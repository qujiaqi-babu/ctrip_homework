import { StyleSheet, Button, Text, View } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="游记详情"
        onPress={() => navigation.navigate("LogDetail")}
      />
    </View>
  );
}
