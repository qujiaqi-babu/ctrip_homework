import { StyleSheet, Button, Text, View } from "react-native";

export default function LogPublicScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Log Public Screen</Text>
      <Button
        title="登录"
        onPress={() => navigation.navigate("MyLogStack", { screen: "Login" })}
      />
    </View>
  );
}
