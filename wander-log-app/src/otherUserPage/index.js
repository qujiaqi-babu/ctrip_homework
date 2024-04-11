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
import {
  api,
  storeDataToAS,
  removeValueFromAS,
  getItemFromAS,
} from "../../util";
const Toast = Overlay.Toast;
const formaDate = new FormData();

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
  // console.log(value);
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("LogDetail", { item: value });
      }}
    >
      <Card containerStyle={{ borderRadius: 10, padding: 0 }}>
        <Card.Image
          style={{ padding: 0 }}
          source={{
            uri: value.imageUrl,
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
          <Text>{value.title}</Text>
          <Text>
            {/* <Badge
              badgeStyle={{}}
              containerStyle={{}}
              status="primary"
              textProps={{}}
              textStyle={{ color: "#EFE" }}
              value={value.state}
              options={{}}
            /> */}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const OtherUserPage = ({ route }) => {
  const { userId } = route.params;
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({});
  const [imageUrl, setImageUrl] = useState();
  const [userAvatarUrl, setUserAvatarUrl] = useState();
  const [myLogDatas, setMyLogDatas] = useState([]);

  const fetchLogDatas = async () => {
    try {
      const response = await api.get(`/myLog/getLogsByUserId/${userId}`);
      if (response.data.data) {
        setMyLogDatas(response.data.data);
      }
    } catch (error) {
      // 数据加载失败
      console.log("获取失败", error);
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await api.get(`/userInfo/getUserById/${userId}`);
      if (response.data.data) {
        setUserInfo(response.data.data);
        setImageUrl(response.data.data.backgroundImage);
        setUserAvatarUrl(response.data.data.userAvatar);
      }
    } catch (error) {
      // 数据加载失败
      console.log("获取失败", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      // 在页面获取焦点时执行的操作
      // console.log("获取用户信息");
      fetchUserData();
      fetchLogDatas();

      // console.log("Screen focused");
      return () => {
        // 在页面失去焦点时执行的清理操作（可选）
        // console.log("Screen unfocused");
      };
    }, [])
  );
  const [index, setIndex] = useState(0);
  // console.log(data);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.user_container}>
          <ImageBackground
            source={imageUrl ? { uri: imageUrl } : {}}
            resizeMode="cover"
            style={styles.background_image}
          >
            <View style={styles.head_container}>
              {/* <Text>导航头</Text> */}
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Icon name="chevron-left" size={40} color="#FFF" />
              </TouchableOpacity>
              <View style={{ flexDirection: "row" }}>
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
                        uri: userAvatarUrl,
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
                  {userInfo ? (
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#FFF",
                        fontSize: 20,
                        fontFamily: "serif",
                      }}
                    >
                      {userInfo.username}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Login");
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
                        游客请登录
                      </Text>
                    </TouchableOpacity>
                  )}
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
                      //todo 关注功能
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
                      关注
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      //todo chat with user
                    }}
                    style={styles.button}
                  >
                    {/* <Icon name="image" color="#FFF" /> */}
                    <Icon
                      style={{ alignItems: "flex-end" }}
                      name="message"
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
              disableIndicator={true}
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
              {/* <Tab.Item>收藏</Tab.Item>
              <Tab.Item>赞过</Tab.Item> */}
            </Tab>
            <TabView value={index} onChange={setIndex} animationType="spring">
              <TabView.Item style={{ width: "100%" }}>
                {myLogDatas ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={myLogDatas}
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
              {/* <TabView.Item style={{ width: "100%" }}>
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
              </TabView.Item> */}
            </TabView>
          </View>
        </View>
      </View>
    </>
  );
};
export default OtherUserPage;
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
