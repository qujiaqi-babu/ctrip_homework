import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MyLogPage from "../MyLogPage";

const LogDetailPage = () => {
  const navigation = useNavigation();

  const handleGoToMyPage = () => {
    navigation.navigate("MyLogPage");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 顶部导航栏 */}
      <View style={styles.topScreen}>
        <View style={styles.leftTopScreen}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios"
              size={30}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.userInfo} onPress={handleGoToMyPage}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../LogPublicPage/1.jpg")}
                style={styles.avatar}
              />
            </View>
            <View style={styles.nickName}>
              <Text style={styles.nameText}>哈哈豆包</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.leftTopScreen}></View>
      </View>

      {/* 中间的滚动视图 */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <Text>
            这是滚动视图的内容，可以放置任意内容，内容超出屏幕高度时会自动滚动。
          </Text>
        </View>
      </ScrollView>

      {/* 底部导航栏 */}
      <View style={styles.topScreen}>
        <Text>底部导航栏</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topScreen: {
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
  },
  leftTopScreen: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBlockColor: "#D5D8DC",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nickName: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 16,
  },
});

export default LogDetailPage;
