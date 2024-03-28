import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Icon, Text, Image } from "@rneui/themed";
export default function LoginScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ flex: 3, justifyContent: "center" }}>
        <Image
          source={require("../../assets/logo_t.png")}
          style={styles.image}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Button
          title="微信登录"
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          buttonStyle={{
            backgroundColor: "rgba(26, 173, 25, 1)",
            borderRadius: 30,
          }}
          titleStyle={{ fontWeight: "bold", fontSize: 23 }}
          containerStyle={{
            marginHorizontal: 50,
            height: 50,
            width: 250,
            marginVertical: 10,
          }}
          onPress={() => console.log("aye")}
        >
          <Icon name="wechat" color="white" />
          <Text style={{ fontSize: 18, color: "#FFF" }}>微信登录</Text>
        </Button>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text
            style={{ textAlign: "center", fontSize: 16, color: "midnightblue" }}
          >
            其他登录方式
          </Text>
          <Icon name="chevron-right" color="#000" />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Text style={{ color: "#778899" }}>我已阅读并同意</Text>
        <TouchableOpacity>
          <Text>《用户协议》</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain", // 控制图片的缩放模式
  },
});
