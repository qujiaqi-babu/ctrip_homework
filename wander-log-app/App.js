import * as React from "react";
import { Button, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
<<<<<<< HEAD
import Home from "./src/Home";
// import LogPublicPage from "./src/LogPublicPage";
import MyLogPage from "./src/MyLogPage/index";
=======
import HomeScreen from "./src/HomePage";
import LogDetailScreen from "./src/LogDetailPage";
import LoginScreen from "./src/LoginPage";
import LogPublicScreen from "./src/LogPublicPage";
import MyLogScreen from "./src/MyLogPage";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
>>>>>>> fb452dbb4ad88131035e6335c5b551d2bae50588

// 首页 堆栈导航
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="LogDetail"
        component={LogDetailScreen}
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
        options={{ headerShown: true }}
      />
    </MyLogStack.Navigator>
  );
}

// 底部导航器
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
<<<<<<< HEAD
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      {/* <Tab.Screen name="LogPublicPage" component={LogPublicPage} /> */}
      <Tab.Screen name="MyLogPage" component={MyLogPage} />
=======
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{ headerShown: false }}
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
>>>>>>> fb452dbb4ad88131035e6335c5b551d2bae50588
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

export default App;
