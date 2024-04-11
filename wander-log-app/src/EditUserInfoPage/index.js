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
  const loaction = "上海华东理工大学";
  const html = `      <html>
      <head>		
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    </head>
      <body>
        <script>
          setTimeout(function () {
            window.ReactNativeWebView.postMessage("Hello!")
          }, 2000)
        </script>
      </body>
      </html>
`;

  const handleMessage = (event) => {
    // console.log("hello");
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
              source={{ uri: "http://10.0.2.2:8080/image/map2.html" }}
              ref={webRef}
              originWhitelist={["*"]}
              useWebKit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scrollEnabled={false}
              onMessage={handleMessage}
              //重写webview的postMessage方法，解决RN无法监听html自带的window.postMessage
              injectedJavaScript={`var cityNameInput = document.getElementById('cityName');
                // 设置 input 元素的值为自己想要的值
              if (cityNameInput) { // 确保元素存在
                  cityNameInput.value ="${loaction}" ;
              } else {
                  console.error('Input element with id "cityName" not found');
              }`}
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
