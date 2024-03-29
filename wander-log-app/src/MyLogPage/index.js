import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
} from "react-native";
import { Icon, Avatar, Tab, Card, TabView } from "@rneui/themed";
const EmyptyItem = ({ name, color, label }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Icon name={name} size={96} color={color}></Icon>
      <Text
        style={{
          paddingTop: 10,
          textAlign: "center",
          fontFamily: "serif",
          fontSize: 16,
          color: "#ccc",
          fontWeight: "bold",
        }}
      >
        {label}
      </Text>
    </View>
  );
};
const RenderItem = ({ value }) => {
  return (
    <Card containerStyle={{ borderRadius: 10, padding: 0 }}>
      <Card.Image
        style={{ padding: 0 }}
        source={{
          uri: value,
        }}
      />
      <Card.Title>上海一日游</Card.Title>
    </Card>
  );
};

const MyLogPage = () => {
  const BASE_URI = "https://source.unsplash.com/random?sig=";
  const data = [
    "https://source.unsplash.com/random?sig=0",
    "https://source.unsplash.com/random?sig=1",
    "https://source.unsplash.com/random?sig=2",
    "https://source.unsplash.com/random?sig=3",
    "https://source.unsplash.com/random?sig=4",
    "https://source.unsplash.com/random?sig=5",
    "https://source.unsplash.com/random?sig=6",
    "https://source.unsplash.com/random?sig=7",
    "https://source.unsplash.com/random?sig=8",
    "https://source.unsplash.com/random?sig=9",
  ];
  const [index, setIndex] = useState(0);
  // console.log(data);
  return (
    <View style={styles.container}>
      <View style={styles.head_container}>
        {/* <Text>导航头</Text> */}
        <TouchableOpacity>
          <Icon name="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.button}>
            {/* <Icon name="image" color="#FFF" /> */}
            <Icon
              style={{ alignItems: "flex-end" }}
              name="image"
              color="#FFF"
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
          <TouchableOpacity>
            <Icon name="share" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content_container}>
        <View style={styles.detail_container}>
          {/* <Text>用户信息</Text> */}
          <View
            style={{
              flex: 3,
              // backgroundColor: "chocolate",
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
              <TouchableOpacity>
                <Avatar
                  size={96}
                  rounded
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/36.jpg",
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 3,
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#FFF",
                  fontSize: 20,
                  fontFamily: "serif",
                }}
              >
                王权
              </Text>
              <Text
                style={{ color: "#FFF", fontSize: 15, fontFamily: "serif" }}
              >
                游客号:123456789
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                color: "#FFF",
                paddingLeft: 20,
                fontFamily: "serif",
                fontWeight: "bold",
              }}
            >
              热爱生活，喜欢游戏，永远在路上
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              // backgroundColor: "cornsilk",
              flexDirection: "row",
              // justifyContent: "space-evenly",
              alignContent: "center",
            }}
          >
            <View style={{ ...styles.box_center, flex: 1 }}>
              <TouchableOpacity>
                <Text style={styles.text_center}>0</Text>
                <Text style={styles.text_center}>关注</Text>
              </TouchableOpacity>
            </View>
            <View style={{ ...styles.box_center, flex: 1 }}>
              <TouchableOpacity>
                <Text style={styles.text_center}>0</Text>
                <Text style={styles.text_center}>粉丝</Text>
              </TouchableOpacity>
            </View>
            <View style={{ ...styles.box_center, flex: 2 }}>
              <TouchableOpacity>
                <Text style={styles.text_center}>0</Text>
                <Text style={styles.text_center}>获赞与收藏</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: "center",
                textAlign: "center",
                flexDirection: "row",
                justifyContent: "flex-end",

                flex: 3,
              }}
            >
              <TouchableOpacity style={styles.button}>
                {/* <Icon name="image" color="#FFF" /> */}
                <Icon
                  style={{ alignItems: "flex-end" }}
                  name="person"
                  color="#FFF"
                />
                <Text
                  style={
                    styles.buttonLabel
                    // selectedValue === value && styles.selectedLabel,
                  }
                >
                  编辑资料
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                {/* <Icon name="image" color="#FFF" /> */}
                <Icon
                  style={{ alignItems: "flex-end" }}
                  name="settings"
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
            {/* <View style={{ ...styles.box_center, flex: 1 }}></View> */}
          </View>
        </View>
        <View style={styles.log_container}>
          <Tab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
              // position: "sticky",
              backgroundColor: "red",
              height: 3,
            }}
            titleStyle={{
              color: "black",
            }}
            variant="default"
            dense
          >
            <Tab.Item>笔记</Tab.Item>
            <Tab.Item>收藏</Tab.Item>
            <Tab.Item>赞过</Tab.Item>
          </Tab>
          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{ width: "100%" }}>
              {data ? (
                <FlatList
                  data={data}
                  numColumns={2}
                  renderItem={({ item, index }) => (
                    <View style={{ width: "50%" }} key={index}>
                      <RenderItem value={item} />
                    </View>
                  )}
                ></FlatList>
              ) : (
                <EmyptyItem
                  name="note-edit-outline"
                  color="lightgray"
                  label="笔记"
                ></EmyptyItem>
              )}
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <EmyptyItem
                name="collections"
                color="lightgray"
                label="收藏了等于学了"
              />
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <EmyptyItem
                name="favorite-border"
                color="lavenderblush"
                label="爱过~"
              />
            </TabView.Item>
          </TabView>
        </View>
      </View>
    </View>
  );
};
export default MyLogPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightslategrey",
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
    paddingBottom: 5,
    // paddingTop: 5,
    // backgroundColor: "skyblue",
    margin: 0,
    padding: 0,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    // backgroundColor: "azure",
    // borderWidth: 2, // 边框宽度
    // borderColor: "gray", // 边框颜色
    // borderStyle: "solid", // 边框样式（实线）
    // padding: 5,
    marginHorizontal: "1%",
    minWidth: "10%",
    marginRight: 10,
    width: "auto",
    // maxWidth: "80%",
    height: "50%",
    // textAlign: "center",
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "white",
  },
  content_container: {
    flex: 18,
    // height: 2000,
    // backgroundColor: "steelblue",
    margin: 0,
    padding: 0,
  },
  detail_container: {
    flex: 1,
    // height: "25%",
    // backgroundColor: "honeydew",
    margin: 0,
    padding: 0,
  },
  box_center: {
    justifyContent: "center",
    textAlign: "center",
  },
  log_container: {
    flex: 2,
    // height: "66%",
    backgroundColor: "white",
    margin: 0,
    padding: 0,
  },
  text_center: {
    textAlign: "center",
    fontFamily: "serif",
    color: "#FFF",
  },
});
