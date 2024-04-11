import React, { Component } from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";

const AMAP_KEY = "655e3eac19997a5973bf339c3e9d2ae2"; // 申请的高德api密钥
const AMAP_PREFIX = "https://restapi.amap.com/v3"; // 高德api前缀

class LBSMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressList: [],
      selectedAddress: {},
    };
  }

  async handleMessage(event) {
    if (!event) {
      return;
    }
    const result = JSON.parse(event.nativeEvent.data);
    switch (result.event) {
      case "getAddressSuccess": {
        const { position } = result.message;
        await this.loadAddressList(position);
        break;
      }
      case "getAddressError": {
        Alert.alert("Error", "Failed to get address");
        break;
      }
      default:
        break;
    }
  }

  async loadAddressList(position) {
    const covertPosition = await this.convertPosition(position);
    if (!covertPosition) {
      return;
    }
    const addressList = await this.regeoPosition(covertPosition);
    this.setState({
      addressList,
      selectedAddress: addressList.length > 0 ? addressList[0] : {},
    });
  }

  async convertPosition(position) {
    const { longitude, latitude } = position;
    const covertUrl = `${AMAP_PREFIX}/assistant/coordinate/convert?key=${AMAP_KEY}&locations=${longitude},${latitude}&coordsys=gps`;
    let covertPosition = "";
    try {
      const response = await fetch(covertUrl);
      const resJson = await response.json();
      const { locations } = resJson;
      covertPosition = locations;
    } catch (err) {
      Alert.alert("Error", `Coordinate conversion failed: ${err}`);
    }
    return covertPosition || "";
  }

  async regeoPosition(covertPosition) {
    const url = `${AMAP_PREFIX}/geocode/regeo?key=${AMAP_KEY}&location=${covertPosition}&extensions=all&batch=false&roadlevel=0`;
    let addressList = [];
    try {
      const response = await fetch(url);
      const resJson = await response.json();
      const { status, info, infoCode, regeocode } = resJson;
      if (!status) {
        Alert.alert("Error", `Address reverse geocoding failed: ${info}`);
        return;
      }
      const { pois = [] } = regeocode;
      addressList = pois.map((item) => ({
        gps: item.location.split(","),
        id: item.id,
        name: `${item.name}(${item.address})`,
      }));
    } catch (err) {
      Alert.alert("Error", `Failed to get nearby information: ${err}`);
    }
    return addressList || [];
  }

  render() {
    return (
      <WebView
        ref={this.props.webViewRef}
        onMessage={this.handleMessage.bind(this)}
        useWebKit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ height: 100 }}
        onLoad={this.props.onLoadWebView}
        source={{ uri: "http://10.0.2.2:8080/image/Loc.html" }}
        scrollEnabled={false}
      />
    );
  }
}

export default LBSMap;
