import { StyleSheet, Button, Text, View } from "react-native";

export default function MyLogScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>My Log Screen</Text>
      <Button
        title="游记详情"
        onPress={() => navigation.navigate("LogDetail")}
      />
      <Button title="登录" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}
