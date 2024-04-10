import * as React from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  Button,
  View,
  TouchableWithoutFeedback,
} from "react-native";
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
import OtherUserScreen from "./src/otherUserPage";
import SettingScreen from "./src/SettingPage";
import AddUserScreen from "./src/AddUserPage";
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
  return (
    <View style={styles.addButton}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("LogPublic")}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableWithoutFeedback>
    </View>
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
        {/* <Tab.Screen
        name="LogPublic"
        component={LogPublicScreen}
        options={{
          tabBarLabel: "游记发布",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-add" color={color} size={size} />
          ),
        }}
      /> */}
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
      <PublishButton />
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
      <Stack.Screen name="LogPublic" component={LogPublicScreen} />
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
    position: "absolute",
    width: 60,
    paddingVertical: 6,
    top: height + 6,
    left: width / 2 - 30,
    borderRadius: 15,
    backgroundColor: "#3498DB",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
