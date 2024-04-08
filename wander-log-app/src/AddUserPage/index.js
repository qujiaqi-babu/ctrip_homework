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

const RenderItem = ({ data }) => {
  console.log(data);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <Avatar
          size={64}
          rounded
          source={{
            uri: data.userAvatar
              ? data.userAvatar
              : "https://randomuser.me/api/portraits/men/36.jpg",
          }}
        />
      </View>
      <View style={{ flex: 3, flexDirection: "column", marginLeft: 10 }}>
        <Text style={{ fontSize: 28 }}>{data.username}</Text>
        <Text>为世界的美好而战</Text>
      </View>
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            borderRadius: 30,
            borderWidth: 1,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 5,
            paddingTop: 5,
          }}
        >
          <Text>关注</Text>
        </TouchableOpacity>
        <Icon name="close"></Icon>
      </View>
    </View>
  );
};

const AddUserScreen = () => {
  // const handleLoginOut = route.params;
  const navigation = useNavigation();
  const data = [{ username: "wjw" }, { username: "king" }];
  return (
    <View style={sideMenuStyles.container}>
      {data ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          numColumns={2}
          renderItem={({ item, index }) => (
            <View
              style={{ width: "100%", padding: 5, marginBottom: 10 }}
              key={index}
            >
              <RenderItem data={item} />
            </View>
          )}
        ></FlatList>
      ) : (
        <Dialog.Loading />
      )}
    </View>
  );
};
export default AddUserScreen;
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
