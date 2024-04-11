import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
} from "react-native";
import {
  Icon,
  Avatar,
  Tab,
  Card,
  Divider,
  ListItem,
  Dialog,
} from "@rneui/themed";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { api } from "../../util";
// 在发送请求之前，添加 token 到请求头
const EditProfile = (props) => {
  return (
    <TextInput
      placeholder="期待您遇见那个ta~"
      style={{
        marginTop: 15,
        paddingLeft: 15,
        backgroundColor: "#FFF",
        width: "100%",
        paddingTop: 15,
        textAlignVertical: "top",
        fontSize: 16,
        borderRadius: 20,
        justifyContent: "flex-start",
      }}
      {...props}
      editable
      maxLength={80}
    />
  );
};

const EditPage = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [profile, setProfile] = React.useState("");
  const [htmlData, setHtmlData] = useState("");
  const webRef = useRef(null);
  const html = `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<!--适应移动端页面展示-->
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
		<title></title>
		<!--引用百度地图API文件-->
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=Asqhnvd151Sdv7yvfejSEi3DhnQKAeRX"></script>
		<style type="text/css">
		    html {
		    	height: 100%
		    }
		    
		    body {
		    	height: 100%;
		    	margin: 0px;
		    	padding: 0px
		    }
		    /*设置容器样式*/
		    #container {
		    	height: 100%;
		    }
		</style>
	</head>
	<body>
		<!--地图存放的div-->
		<div id="container"></div>
		<script type="text/javascript">
			//创建地址实例
			var map = new BMap.Map("container"); 
			//设置中心的坐标
			var point = new BMap.Point();
			//初始化地图页面，设置中心点坐标和地图级别  
			map.centerAndZoom(point, 15); 
			//开启鼠标滚轮缩放地图
			map.enableScrollWheelZoom(true);
			
			//添加控件
			//缩略地图OverviewMapControl，默认位于地图右下方，是一个可折叠的缩略地图
			map.addControl(new BMap.OverviewMapControl());
			//地图类型MapTypeControl, 默认位于地图右上方
			map.addControl(new BMap.MapTypeControl());
			//平移缩放控件 NavigationControl	, PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
			map.addControl(new BMap.NavigationControl());
			//比例尺ScaleControl, 默认位于地图左下方，显示地图的比例关系
			//map.addControl(new BMap.ScaleControl());
			//设置控件位置偏移，x,y轴
			var opts = {offset: new BMap.Size(90, 30)}
			map.addControl(new BMap.ScaleControl(opts));
  			window.ReactNativeWebView.postMessage("hello",'*');
			//根据浏览器定位，之后显示当前位置
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					var mk = new BMap.Marker(r.point);
					map.addOverlay(mk);
					map.panTo(r.point);
					var latCurrent = r.point.lat;
					var lngCurrent = r.point.lng;
					alert('您的位置：'+r.point.lng+','+r.point.lat);

					//设置导航终点，起始位置到终点位置
					//location.href = "http://api.map.baidu.com/direction?origin=" + latCurrent + "," + lngCurrent + 
					//"&destination=30.4325,111.182311&mode=driving&region=随便写的一个地址&output=html";
				}
				else {
					alert('failed'+this.getStatus());
				}        
			});
		</script>
	</body>
</html>`;

  const handleMessage = (event) => {
    console.log("hello");
    // 获取来自 WebView 的消息
    const message = event.nativeEvent.data;
    setHtmlData(message); // 更新状态以显示 HTML 页面的数据
    console.log(message);
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/userInfo/info");
      // console.log(response.data.data);
      setData(response.data.data);
      setProfile(response.data.data.profile);
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
  const handleSave = async () => {
    //保存信息
    try {
      await api
        .put(
          "/userInfo/update", // 虚拟机不能使用localhost
          { ...data, profile: profile }
        )
        .then((res) => {
          console.log("提交成功:", res.data.message);
          // 提交成功后跳转到我的游记页面，并刷新
          navigation.goBack();
        })
        .catch((err) => {
          console.log("提交失败:", err.response.data.message);
          setErrorMessage(err.response.data.message);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {data ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text
                style={{ color: "black", fontSize: 18, fontFamily: "serif" }}
              >
                取消
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "black", fontSize: 18, fontFamily: "serif" }}>
              编辑简介
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text
                style={{ color: "#EE3B3B", fontSize: 18, fontFamily: "serif" }}
              >
                保存
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <EditProfile
              multiline
              numberOfLines={10}
              onChangeText={(text) => setProfile(text)}
              value={profile}
            />
            <WebView
              style={{
                width: 400,
                height: 400,
                // backgroundColor: "red",
              }}
              // source={{ html }}
              source={{ uri: "http://10.0.2.2:8080/image/map.html" }}
              ref={webRef}
              originWhitelist={["*"]}
              onMessage={handleMessage}
              //重写webview的postMessage方法，解决RN无法监听html自带的window.postMessage
              injectedJavaScript={`(function() {
              window.postMessage = function(data) {
                window.ReactNativeWebView.postMessage(data)
              }
              })();`}
            />
          </View>
        </View>
      ) : (
        <View>
          <Dialog.Loading />
        </View>
      )}
    </View>
  );
};
export default EditPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    // paddingTop: 10,
    padding: 15,
  },
  header: {
    // backgroundColor: "red",
    paddingTop: 50,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 18,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    // width: "80%",
  },
});
