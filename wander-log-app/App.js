import * as React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/HomePage";
import LogDetailScreen from "./src/LogDetailPage";
import LoginScreen from "./src/LoginPage";
import LogPublicScreen from "./src/LogPublicPage";
import MyLogScreen from "./src/MyLogPage";
import UserInfoScreen from "./src/UserInfoPage";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

// 屏幕高度
const screenHeight = Dimensions.get("window").height;

// 首页 堆栈导航
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="LogDetail"
        component={LogDetailScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="MyLogPage"
        component={MyLogScreen}
        options={{ headerShown: true }}
      />
    </HomeStack.Navigator>
  );
}

// 我的游记 堆栈导航
const MyLogStack = createNativeStackNavigator();
function MyLogStackScreen() {
  return (
    <MyLogStack.Navigator screenOptions={{ headerShown: false }}>
      <MyLogStack.Screen name="MyLog" component={MyLogScreen} />
      <MyLogStack.Screen
        name="LogDetail"
        component={LogDetailScreen}
        options={{ headerShown: true }}
      />
      <MyLogStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <MyLogStack.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{ headerShown: false }}
      />
    </MyLogStack.Navigator>
  );
}

// 底部导航器
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      // tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={
        // ({ route }) => ({
        //   tabBarVisible: route.name !== "LogPublic", // 当路由名为 'Home' 时，隐藏底部导航栏
        // })
        {
          headerShown: false,
          // tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarText,
          tabBarHideOnKeyboard: true,
        }
      }
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
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
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-add" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyLogStack"
        component={MyLogStackScreen}
        options={{
          tabBarLabel: "我的游记",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 主应用组件
function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // position: "absolute",
    // top: screenHeight + 3,
    display: "none",
  },
  tabBarText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default App;
