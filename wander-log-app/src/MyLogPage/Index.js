import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Icon, Avatar } from "@rneui/themed";
const MyLogPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.head_container}>
        {/* <Text>导航头</Text> */}
        <Icon name="menu" color="#FFF" />
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.button}>
            {/* <Icon name="image" color="#FFF" /> */}
            <Icon
              style={{ alignItems: "flex-end" }}
              name="image"
              color="#000"
            />
            <Text
              style={
                styles.buttonLabel
                // selectedValue === value && styles.selectedLabel,
              }
            >
              设置背景
            </Text>
          </TouchableOpacity>
          <Icon name="share" color="#FFF" />
        </View>
      </View>
      <View style={styles.content_container}>
        <View style={styles.detail_container}>
          {/* <Text>用户信息</Text> */}
          <View
            style={{
              flex: 3,
              backgroundColor: "chocolate",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                size={96}
                rounded
                source={{
                  uri: "https://randomuser.me/api/portraits/men/36.jpg",
                }}
              />
            </View>

            <View
              style={{
                flex: 3,
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontFamily: "serif" }}>王权</Text>
              <Text style={{ fontSize: 15, fontFamily: "serif" }}>
                游客号:123456789
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ paddingLeft: 10, fontFamily: "monospace" }}>
              热爱生活，喜欢游戏，永远在路上
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              backgroundColor: "cornsilk",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View>
              <Text>0</Text>
              <Text>关注</Text>
            </View>
            <View>
              <Text>0</Text>
              <Text>粉丝</Text>
            </View>
            <View>
              <Text>0</Text>
              <Text>获赞与收藏</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.button}>
                {/* <Icon name="image" color="#FFF" /> */}
                <Icon
                  style={{ alignItems: "flex-end" }}
                  name="image"
                  color="#000"
                />
                <Text
                  style={
                    styles.buttonLabel
                    // selectedValue === value && styles.selectedLabel,
                  }
                >
                  设置背景
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.button}>
                {/* <Icon name="image" color="#FFF" /> */}
                <Icon
                  style={{ alignItems: "flex-end" }}
                  name="image"
                  color="#000"
                />
                <Text
                  style={
                    styles.buttonLabel
                    // selectedValue === value && styles.selectedLabel,
                  }
                >
                  设置背景
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.log_container}>
          <Text>作品信息</Text>
        </View>
      </View>
    </View>
  );
};
export default MyLogPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "powderblue",
    margin: 0,
    padding: 0,
  },
  head_container: {
    position: "sticky",
    flex: 2,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    // paddingTop: 5,
    backgroundColor: "skyblue",
    margin: 0,
    padding: 0,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "azure",
    // alignSelf: "flex-start",
    marginHorizontal: "1%",
    minWidth: "20%",
    // textAlign: "center",
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "black",
  },
  content_container: {
    flex: 18,
    backgroundColor: "steelblue",
    margin: 0,
    padding: 0,
  },
  detail_container: {
    flex: 1,
    backgroundColor: "honeydew",
    margin: 0,
    padding: 0,
  },
  log_container: {
    flex: 2,
    backgroundColor: "lavenderblush",
    margin: 0,
    padding: 0,
  },
});
