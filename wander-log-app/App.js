import * as React from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  Button,
  View,
  TouchableWithoutFeedback,
  Overlay,
} from "react-native";
const Toast = Overlay.Toast;
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import HomeScreen from "./src/HomePage";
import LogDetailScreen from "./src/LogDetailPage";
import LoginScreen from "./src/LoginPage";
import RegisterScreen from "./src/RegisterPage";
import LogPublicScreen from "./src/LogPublicPage";
import MyLogScreen from "./src/MyLogPage";
import UserInfoScreen from "./src/UserInfoPage";
import EditPage from "./src/EditUserInfoPage";
import OtherUserScreen from "./src/otherUserPage";
import SettingScreen from "./src/SettingPage";
import AddUserScreen from "./src/AddUserPage";
import ShareToUserScreen from "./src/ShareToUserPage";
import {
  api,
  setAuthHeader,
  storeDataToAS,
  removeValueFromAS,
  getItemFromAS,
} from "./util";

import { MaterialIcons, Ionicons } from "@expo/vector-icons";

// 发布游记按钮
function PublishButton() {
  const navigation = useNavigation();
  const addButtonPress = async () => {
    let user = await getItemFromAS("userInfo");
    user = JSON.parse(user);
    if (user) {
      navigation.navigate("LogPublic");
    } else {
      Toast.show("请先登录~");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={addButtonPress}>
      <View style={styles.addButton}>
        <MaterialIcons name="add" size={32} color="white" />
      </View>
    </TouchableWithoutFeedback>
  );
}

// 底部导航栏
const Tab = createBottomTabNavigator();
function HomeTabScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: styles.tabBarText,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: "#3498DB",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "游记列表",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="travel-explore" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="LogPublic"
          component={LogPublicScreen}
          options={{
            tabBarLabel: "游记发布",
            // tabBarIcon: ({ color, size }) => (
            //   <MaterialIcons name="library-add" color={color} size={size} />
            // ),
            tabBarButton: () => <PublishButton />,
            tabBarStyle: { display: "none" },
          }}
        />
        <Tab.Screen
          name="MyLog"
          component={MyLogScreen}
          options={{
            tabBarLabel: "我的游记",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
      {/* <PublishButton /> */}
    </View>
  );
}

// 堆栈导航
const Stack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeTab" component={HomeTabScreen} />
      <Stack.Screen name="LogDetail" component={LogDetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="LogPublic" component={LogPublicScreen} /> */}
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "设置",
        }}
      />

      <Stack.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "编辑信息",
        }}
      />
      <Stack.Screen
        name="EditPage"
        component={EditPage}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerTitle: "编辑信息",
        }}
      />
      {/* Todo 此处应设置新页面-UserLogPage */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "",
        }}
      />
      {/* <Stack.Screen
        name="MyLogPage"
        component={MyLogScreen}
        options={{
          headerShown: false,
          headerTitle: "UserLogPage",
        }}
      /> */}
      <Stack.Screen
        name="OtherUserLog"
        component={OtherUserScreen}
        options={{
          headerShown: false,
          headerTitle: "otherUserLogPage",
        }}
      />
      <Stack.Screen
        name="AddUser"
        component={AddUserScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "发现好友",
        }}
      />
      <Stack.Screen
        name="ShareToUser"
        component={ShareToUserScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "分享给好友",
        }}
      />
    </Stack.Navigator>
  );
}

// 主应用组件
function App() {
  // 页面首次加载时获取用户身份验证Token
  useEffect(() => {
    setAuthHeader();
    // api.interceptors.request.use(
    //   async (config) => {
    //     config.interceptors = "AddAuthorizationToken";
    //     const token = await getItemFromAS("token");
    //     // console.log(token);
    //     if (token) {
    //       config.headers.Authorization = `${token}`;
    //     }
    //     return config;
    //   },
    //   (error) => {
    //     console.log(error);
    //     return Promise.reject(error);
    //   }
    // );
  }, []);
  return (
    <NavigationContainer>
      <HomeStackScreen />
    </NavigationContainer>
  );
}

// 屏幕宽高
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  tabBarText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    // position: "absolute",
    width: 60,
    paddingVertical: 6,
    // top: height + 6,
    // bottom: 2,
    // left: width / 2 - 30,
    borderRadius: 15,
    backgroundColor: "#3498DB",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
});

export default App;
