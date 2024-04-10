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

import { api } from "../../util";
// 在发送请求之前，添加 token 到请求头
const EditProfile = (props) => {
  return <TextInput {...props} editable maxLength={40} />;
};

const EditPage = () => {
  const [data, setData] = useState({});
  const [profile, setProfile] = React.useState("期待您遇见那个ta");
  const fetchData = async () => {
    try {
      const response = await api.get("/userInfo/info");
      // console.log(response.data.data);
      setData(response.data.data);
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View style={sideMenuStyles.container}>
      {data ? (
        <View style={styles.container}>
          <EditProfile
            multiline
            numberOfLines={4}
            onChangeText={(text) => setProfile(text)}
            value={profile}
          />
        </View>
      ) : (
        <Dialog.Loading />
      )}
    </View>
  );
};
export default EditPage;
const styles = StyleSheet.create({
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
    maxWidth: "60%",
    // overflow: "hidden",
  },
  field: {
    color: "#555",
  },
});
