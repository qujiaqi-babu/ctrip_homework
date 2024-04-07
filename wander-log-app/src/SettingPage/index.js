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
  Alert,
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
import { api, getItemFromAS, removeValueFromAS } from "../../util";

const SettingPage = () => {
  // const handleLoginOut = route.params;
  const navigation = useNavigation();
  const data = {
    // avatar_url: "https://randomuser.me/api/portraits/men/36.jpg",
    username: "",
    userId: "",
    introduction: "",
    gender: "",
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
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "flex-start",
              alignContent: "space-between",
            }}
          >
            <View style={sideMenuStyles.box_container}>
              <TouchableOpacity>
                <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                  <ListItem.Content style={sideMenuStyles.menuItem}>
                    <ListItem.Title style={sideMenuStyles.field}>
                      账号与安全
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
                      隐私设置
                    </ListItem.Title>
                    <View style={sideMenuStyles.valueItem}>
                      <ListItem.Title>{data.userId}</ListItem.Title>
                      <Icon name="chevron-right"></Icon>
                    </View>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            </View>
            <View style={sideMenuStyles.box_container}>
              <TouchableOpacity>
                <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                  <ListItem.Content style={sideMenuStyles.menuItem}>
                    <ListItem.Title style={sideMenuStyles.field}>
                      通知设置
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
                      添加小组件
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
                      通用设置
                    </ListItem.Title>
                    <View style={sideMenuStyles.valueItem}>
                      <ListItem.Title>{data.work}</ListItem.Title>
                      <Icon name="chevron-right"></Icon>
                    </View>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            </View>
            <View style={sideMenuStyles.box_container}>
              <TouchableOpacity>
                <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                  <ListItem.Content style={sideMenuStyles.menuItem}>
                    <ListItem.Title style={sideMenuStyles.field}>
                      个人信息收集清单
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
                      鼓励一下
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
                      关于携程旅游日记
                    </ListItem.Title>
                    <View style={sideMenuStyles.valueItem}>
                      <ListItem.Title>{data.backgroundImage}</ListItem.Title>
                      <Icon name="chevron-right"></Icon>
                    </View>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            </View>
            <View style={sideMenuStyles.box_container}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "登出",
                    "确定登出？",
                    [
                      {
                        text: "取消",
                        style: "cancel",
                      },
                      {
                        text: "确定",
                        onPress: async () => {
                          // handleLoginOut();
                          await removeValueFromAS("userInfo");
                          await removeValueFromAS("token");
                          api.interceptors.request.eject(
                            "AddAuthorizationToken"
                          );
                          navigation.popToTop();
                          navigation.navigate("Login");
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <ListItem style={{ backgroundColor: "#E5E7E9" }}>
                  <ListItem.Content style={{ alignItems: "center" }}>
                    <ListItem.Title style={{ fontSize: 18, color: "red" }}>
                      退出登录
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            </View>
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
    backgroundColor: "#EEE",
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
  box_container: {
    borderRadius: 20,
    // borderWidth: 1,
    backgroundColor: "#FFF",
    padding: 5,
    marginTop: 10,
  },
});
