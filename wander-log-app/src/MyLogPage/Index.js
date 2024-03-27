import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
const MyLogPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.head_container}>
        {/* <Text>导航头</Text> */}
        <Icon name="menu" color="#FFF" />
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.button}>
            {/* <Icon name="image" color="#FFF" /> */}
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
          <Text>用户信息</Text>
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
    position: "fixed",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    // paddingTop: 5,
    backgroundColor: "skyblue",
    margin: 0,
    padding: 0,
  },
  button: {
    flexDirection: "column",
    borderRadius: 4,
    backgroundColor: "oldlace",
    // alignSelf: "flex-start",
    marginHorizontal: "1%",
    minWidth: "20%",
    textAlign: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "coral",
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
