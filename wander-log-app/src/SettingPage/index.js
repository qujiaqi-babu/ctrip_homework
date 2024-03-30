import React, { useState, useEffect } from "react";
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
import {
  Icon,
  Avatar,
  Tab,
  Card,
  Divider,
  ListItem,
  Dialog,
} from "@rneui/themed";

import { useNavigation } from "@react-navigation/native";
const SettingPage = () => {
  const data = {
    avatar_url: "https://randomuser.me/api/portraits/men/36.jpg",
    username: "王权",
    userId: "12345678",
    introduction: " 热爱生活，喜欢游戏，永远在路上，热爱每一天!!",
    gender: "男",
    birthday: "",
    work: "",
    location: "",
    school: "",
    backgroundImage: "",
    hobby: "",
  };
  return (
    <View style={sideMenuStyles.container}>
      {data ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          // showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <View style={{ padding: 20 }}>
            <TouchableOpacity>
              <Avatar
                size={128}
                rounded
                source={{
                  uri: "https://randomuser.me/api/portraits/men/36.jpg",
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "flex-start",
              alignContent: "space-between",
            }}
          >
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    姓名
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.username}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    游客号
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.userId}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    简介
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title numberOfLines={3} style={{ flex: 1 }}>
                      {data.introduction}
                    </ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    性别
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.gender}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    生日
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.birthday}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    职业
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.work}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    地区
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.location}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    学校
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.school}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    背景图
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.backgroundImage}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                <ListItem.Content style={sideMenuStyles.menuItem}>
                  <ListItem.Title style={sideMenuStyles.field}>
                    兴趣
                  </ListItem.Title>
                  <View style={sideMenuStyles.valueItem}>
                    <ListItem.Title>{data.hobby}</ListItem.Title>
                    <Icon name="chevron-right"></Icon>
                  </View>
                </ListItem.Content>
              </ListItem>
              <Divider />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <Dialog.Loading />
      )}
    </View>
  );
};
export default SettingPage;
const sideMenuStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  menuItem: {
    // width: "50%",
    // paddingRight: 10,
    justifyContent: "space-between",
    flexDirection: "row",

    // backgroundColor: "red",
  },
  valueItem: {
    // backgroundColor: "red",
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "80%",
    // overflow: "hidden",
  },
  field: {
    color: "#555",
  },
});
