import * as React from "react";
import { Button, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./src/Home";
import LogPublicPage from "./src/LogPublicPage";
// import MyLogPage from "./src/MyLogPage";

// 定义两个示例屏幕
// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate("Details")}
//       />
//     </View>
//   );
// }
function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

// 创建堆栈导航器
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="LogPublicPage" component={LogPublicPage} />
      {/* <Stack.Screen name="MyLogPage" component={MyLogPage} /> */}
    </Stack.Navigator>
  );
}

// 创建底部导航器
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="LogPublicPage" component={LogPublicPage} />
      {/* <Tab.Screen name="MyLogPage" component={MyLogPage} /> */}
    </Tab.Navigator>
  );
}

// 主应用组件
function App() {
  return (
    <NavigationContainer>
      {/* <MyStack /> */}
      <MyTabs />
    </NavigationContainer>
  );
}

export default App;
