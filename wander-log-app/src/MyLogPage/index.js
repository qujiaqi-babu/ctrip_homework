import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  Modal,
  Overlay,
  ImageBackground,
} from "react-native";
import {
  Icon,
  Avatar,
  Tab,
  Card,
  TabView,
  Divider,
  BottomSheet,
  ListItem,
  Badge,
} from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Drawer from "react-native-drawer";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import * as FileSystem from "expo-file-system";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { useFocusEffect } from "@react-navigation/native";

const Toast = Overlay.Toast;

//侧边菜单栏
const ContentView = ({ onCloseDrawer }) => {
  const navigation = useNavigation();
  return (
    <View style={sideMenuStyles.container}>
      <View
        style={{
          flex: 8,
          justifyContent: "flex-start",
          paddingLeft: 10,
          // backgroundColor: "#EAEDED",
        }}
      >
        <TouchableOpacity>
          <ListItem style={{ backgroundColor: "#E5E7E9" }}>
            <ListItem.Content style={sideMenuStyles.menuItem}>
              <Icon name="person-add-alt"></Icon>
              <ListItem.Title>发现好友</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity>
          <ListItem style={{ backgroundColor: "#E5E7E9" }}>
            <ListItem.Content style={sideMenuStyles.menuItem}>
              <Icon name="history"></Icon>
              <ListItem.Title>浏览记录</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity>
          <ListItem style={{ backgroundColor: "#E5E7E9" }}>
            <ListItem.Content style={sideMenuStyles.menuItem}>
              <Icon name="sim-card"></Icon>
              <ListItem.Title>免流量</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <ListItem style={{ backgroundColor: "#E5E7E9" }}>
            <ListItem.Content style={sideMenuStyles.menuItem}>
              <Icon name="eco"></Icon>
              <ListItem.Title>社区公约</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onCloseDrawer();
            navigation.navigate("Setting");
          }}
        >
          <View>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "#F8F9F9",
                padding: 5,
              }}
            >
              <Icon name="settings" color={"#2E4053"}></Icon>
            </View>
            <Text style={{ textAlign: "center" }}>设置</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "#F8F9F9",
                padding: 5,
              }}
            >
              <Icon name="headset" color={"#2E4053"}></Icon>
            </View>
            <Text style={{ textAlign: "center" }}>帮助与客服</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "#F8F9F9",
                padding: 5,
              }}
            >
              <Icon name="qr-code-scanner" color={"#2E4053"}></Icon>
            </View>
            <Text style={{ textAlign: "center" }}>扫一扫</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
//内容为空组件
const EmyptyItem = ({ name, color, label }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Icon name={name} size={96} color={color}></Icon>
      <Text
        style={{
          paddingTop: 10,
          textAlign: "center",
          fontFamily: "serif",
          fontSize: 16,
          color: "#ccc",
          fontWeight: "bold",
        }}
      >
        {label}
      </Text>
    </View>
  );
};
//渲染组件
const RenderItem = ({ value }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("LogPublic");
      }}
    >
      <Card containerStyle={{ borderRadius: 10, padding: 0 }}>
        <Card.Image
          style={{ padding: 0 }}
          source={{
            uri: value,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginBottom: 10,
            marginTop: 5,
          }}
        >
          <Text>上海一日游</Text>
          <Text>
            <Badge
              badgeStyle={{}}
              containerStyle={{}}
              status="primary"
              textProps={{}}
              textStyle={{ color: "#EFE" }}
              value="审核中"
              options={{}}
            />
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const MyLogPage = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [imageUrl, setImageUrl] = useState();
  const [imageData, setImageData] = useState();
  const [modalVisible, setModalVisible] = useState(false); // 上传照片模态框
  const list = [
    { title: "List Item 1" },
    { title: "List Item 2" },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];
  // const [isRender, setIsRender] = useState(false);
  const BASE_URI = "https://source.unsplash.com/random?sig=";
  const data = [
    "https://source.unsplash.com/random?sig=0",
    "https://source.unsplash.com/random?sig=1",
    "https://source.unsplash.com/random?sig=2",
    "https://source.unsplash.com/random?sig=3",
    "https://source.unsplash.com/random?sig=4",
    "https://source.unsplash.com/random?sig=5",
    "https://source.unsplash.com/random?sig=6",
    "https://source.unsplash.com/random?sig=7",
    "https://source.unsplash.com/random?sig=8",
    "https://source.unsplash.com/random?sig=9",
  ];
  const fetchUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userInfo");
      let user = JSON.parse(jsonValue);
      setUserInfo(user);
      setImageUrl(user.backgroundImage);
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      // 在页面获取焦点时执行的操作
      fetchUserData();
      // console.log("Screen focused");
      return () => {
        // 在页面失去焦点时执行的清理操作（可选）
        // console.log("Screen unfocused");
      };
    }, [])
  );
  const [index, setIndex] = useState(0);
  // console.log(data);
  const showSideMenu = () => {
    setVisible(true);
  };
  const closeSideMenu = () => {
    setVisible(false);
  };
  // 第一次使用图片上传功能时会先授权
  const verifyPermission = async () => {
    const result = await ImagePicker.getCameraPermissionsAsync();
    // console.log(result);
    if (!result.granted) {
      Toast.show("需要相机权限才能使用相机");
      const askPermission = await ImagePicker.requestCameraPermissionsAsync();
      // console.log(askPermission);
      if (!askPermission.granted) {
        Alert.alert(
          "Insufficient Permissions",
          "You need to grant camera permissions to be able to upload your images",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };
  // 相册图片上传
  const handleUploadImage = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    // 返回一个promise对象
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 允许选择所有类型的媒体
      allowsEditing: true,
      quality: 0.5,
    });
    const url = image.assets[0].uri;
    const suffix = url.substring(url.lastIndexOf(".") + 1);
    try {
      // 读取图片的内容
      const data = await FileSystem.readAsStringAsync(url, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // 传给后端图片数据和后缀名
      setImageData([data, suffix]);
    } catch (error) {
      console.log("Error reading image file:", error);
    }

    setImageUrl(url);
    setModalVisible(false); // 拍照上传后关闭模态框
  };

  // 拍照上传
  const handleTakeImage = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    // 返回一个promise对象
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });
    const url = image.assets[0].uri;
    const suffix = url.substring(url.lastIndexOf(".") + 1);
    try {
      // 读取图片的内容
      const data = await FileSystem.readAsStringAsync(url, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImageData([data, suffix]);
    } catch (error) {
      console.log("Error reading image file:", error);
    }

    setImageUrl(url);
    // 获取imageData
    setModalVisible(false); // 拍照上传后关闭模态框
  };
  return (
    <>
      {/* 图片上传方式选择模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                height: "20%",
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={handleTakeImage}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>拍照</Text>
              </TouchableOpacity>
              <View
                style={{
                  height: 2,
                  width: "100%",
                  backgroundColor: "#D1CFCF",
                  marginVertical: 10,
                }}
              ></View>
              <TouchableOpacity
                onPress={handleUploadImage}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>从相册上传</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Drawer
        type="overlay"
        open={visible}
        content={<ContentView onCloseDrawer={closeSideMenu} />}
        tapToClose={true}
        onClose={closeSideMenu}
        openDrawerOffset={0.3} // 20% gap on the right side of drawer
        panCloseMask={0.3}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          main: { opacity: (2 - ratio) / 2 },
        })}
      >
        <View style={styles.container}>
          {/* <SafeAreaProvider>
            <BottomSheet
              // modalProps={{ presentationStyle: "fullScreen" }}
              // containerStyle={{ backgroundColor: "red" }}
              isVisible={isVisible}
            >
              <ListItem
                onPress={() => {
                  setIsVisible(false);
                }}
                style={{ backgroundColor: "green" }}
              >
                <ListItem.Content>
                  <ListItem.Title>关闭</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </BottomSheet>
          </SafeAreaProvider> */}
          <View style={styles.user_container}>
            <ImageBackground
              source={imageUrl ? { uri: imageUrl } : {}}
              resizeMode="cover"
              style={styles.background_image}
            >
              <View style={styles.head_container}>
                {/* <Text>导航头</Text> */}
                <TouchableOpacity onPress={showSideMenu}>
                  <Icon name="menu" size={28} color="#FFF" />
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(true)}
                  >
                    {/* <Icon name="image" color="#FFF" /> */}
                    <Icon
                      style={{ alignItems: "flex-end" }}
                      name="image"
                      color="#FFF"
                    />
                    <Text
                      style={
                        styles.buttonLabel
                        // selectedValue === value && styles.selectedLabel,
                      }
                    >
                      设置背景
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon name="share" size={28} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.detail_container}>
                {/* <Text>用户信息</Text> */}
                <View
                  style={{
                    flex: 3,
                    // backgroundColor: "chocolate",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flex: 2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity>
                      <Avatar
                        size={96}
                        rounded
                        source={{
                          uri: userInfo && userInfo.userAvatar,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flex: 3,
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#FFF",
                        fontSize: 20,
                        fontFamily: "serif",
                      }}
                    >
                      {userInfo ? userInfo.username : "游客请登录"}
                    </Text>
                    <Text
                      style={{
                        color: "#FFF",
                        fontSize: 15,
                        fontFamily: "serif",
                      }}
                    >
                      游客号:{userInfo ? userInfo.customId : ""}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{
                      color: "#FFF",
                      paddingLeft: 20,
                      fontFamily: "serif",
                      fontWeight: "bold",
                    }}
                  >
                    {userInfo ? userInfo.profile : "期待与你相遇"}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 2,
                    // backgroundColor: "cornsilk",
                    flexDirection: "row",
                    // justifyContent: "space-evenly",
                    alignContent: "center",
                  }}
                >
                  <View style={{ ...styles.box_center, flex: 1 }}>
                    <TouchableOpacity>
                      <Text style={styles.text_center}>0</Text>
                      <Text style={styles.text_center}>关注</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ ...styles.box_center, flex: 1 }}>
                    <TouchableOpacity>
                      <Text style={styles.text_center}>0</Text>
                      <Text style={styles.text_center}>粉丝</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ ...styles.box_center, flex: 2 }}>
                    <TouchableOpacity>
                      <Text style={styles.text_center}>0</Text>
                      <Text style={styles.text_center}>获赞与收藏</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      textAlign: "center",
                      flexDirection: "row",
                      justifyContent: "flex-end",

                      flex: 3,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("UserInfo");
                      }}
                      style={styles.button}
                    >
                      {/* <Icon name="image" color="#FFF" /> */}
                      <Icon
                        style={{ alignItems: "flex-end" }}
                        name="person"
                        color="#FFF"
                      />
                      <Text
                        style={
                          styles.buttonLabel
                          // selectedValue === value && styles.selectedLabel,
                        }
                      >
                        编辑资料
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Setting");
                      }}
                      style={styles.button}
                    >
                      {/* <Icon name="image" color="#FFF" /> */}
                      <Icon
                        style={{ alignItems: "flex-end" }}
                        name="settings"
                        color="#FFF"
                      />
                    </TouchableOpacity>
                  </View>
                  {/* <View style={{ ...styles.box_center, flex: 1 }}></View> */}
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.content_container}>
            <View style={styles.log_container}>
              <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                  // position: "sticky",
                  backgroundColor: "red",
                  height: 3,
                }}
                titleStyle={{
                  color: "black",
                }}
                variant="default"
                dense
              >
                <Tab.Item>笔记</Tab.Item>
                <Tab.Item>收藏</Tab.Item>
                <Tab.Item>赞过</Tab.Item>
              </Tab>
              <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: "100%" }}>
                  {data ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={data}
                      numColumns={2}
                      renderItem={({ item, index }) => (
                        <View style={{ width: "50%" }} key={index}>
                          <RenderItem value={item} />
                        </View>
                      )}
                    ></FlatList>
                  ) : (
                    <EmyptyItem
                      name="note-edit-outline"
                      color="lightgray"
                      label="笔记"
                    ></EmyptyItem>
                  )}
                </TabView.Item>
                <TabView.Item style={{ width: "100%" }}>
                  <EmyptyItem
                    name="collections"
                    color="lightgray"
                    label="收藏了等于学了"
                  />
                </TabView.Item>
                <TabView.Item style={{ width: "100%" }}>
                  <EmyptyItem
                    name="favorite-border"
                    color="lavenderblush"
                    label="爱过~"
                  />
                </TabView.Item>
              </TabView>
            </View>
          </View>
        </View>
      </Drawer>
    </>
  );
};
export default MyLogPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,

    margin: 0,
    padding: 0,
  },
  head_container: {
    position: "sticky",
    flex: 2,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    // paddingTop: 5,
    // backgroundColor: "skyblue",
    margin: 0,
    padding: 0,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    // backgroundColor: "azure",
    // borderWidth: 2, // 边框宽度
    // borderColor: "gray", // 边框颜色
    // borderStyle: "solid", // 边框样式（实线）
    // padding: 5,
    marginHorizontal: "1%",
    minWidth: "10%",
    marginRight: 10,
    width: "auto",
    // maxWidth: "80%",
    height: "50%",
    // textAlign: "center",
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "white",
  },
  content_container: {
    flex: 12,
    margin: 0,
    padding: 0,
  },
  background_image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#828282",
  },
  user_container: {
    flex: 8,
    margin: 0,
    padding: 0,
  },
  detail_container: {
    flex: 6,
    // height: "25%",
    // backgroundColor: "honeydew",
    margin: 0,
    padding: 0,
  },
  box_center: {
    justifyContent: "center",
    textAlign: "center",
  },
  log_container: {
    flex: 12,
    // height: "66%",
    backgroundColor: "white",
    margin: 0,
    padding: 0,
  },
  text_center: {
    textAlign: "center",
    fontFamily: "serif",
    color: "#FFF",
  },
});
const drawerStyles = {
  drawer: { shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
};
const sideMenuStyles = {
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 100,
  },
  menuItem: {
    // width: "50%",
    paddingRight: 10,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    // backgroundColor: "red",
  },
};
