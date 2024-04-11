import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
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
import LBSMap from "./components/LBSMap";
import { useNavigation } from "@react-navigation/native";
import { api } from "../../util";
// 在发送请求之前，添加 token 到请求头
const EditProfile = (props) => {
  return (
    <TextInput
      placeholder="期待您遇见那个ta~"
      style={{
        marginTop: 15,
        paddingLeft: 15,
        backgroundColor: "#FFF",
        width: "100%",
        paddingTop: 15,
        textAlignVertical: "top",
        fontSize: 16,
        borderRadius: 20,
        justifyContent: "flex-start",
      }}
      {...props}
      editable
      maxLength={80}
    />
  );
};

const EditPage = () => {
  const navigation = useNavigation();
  const [couldSave, setCouldSave] = useState(false);
  const [data, setData] = useState({});
  const [profile, setProfile] = React.useState("");

  const fetchData = async () => {
    try {
      const response = await api.get("/userInfo/info");
      // console.log(response.data.data);
      setData(response.data.data);
      setProfile(response.data.data.profile);
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
  const handleSave = async () => {
    //保存信息
    try {
      await api
        .put(
          "/userInfo/update", // 虚拟机不能使用localhost
          { ...data, profile: profile }
        )
        .then((res) => {
          console.log("提交成功:", res.data.message);
          // 提交成功后跳转到我的游记页面，并刷新
          navigation.goBack();
        })
        .catch((err) => {
          console.log("提交失败:", err.response.data.message);
          setErrorMessage(err.response.data.message);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {data ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text
                style={{ color: "black", fontSize: 18, fontFamily: "serif" }}
              >
                取消
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "black", fontSize: 18, fontFamily: "serif" }}>
              编辑简介
            </Text>
            <TouchableOpacity disabled={!couldSave} onPress={handleSave}>
              <Text
                style={
                  couldSave ? styles.TextButton : styles.disabledTextButton
                }
              >
                保存
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <EditProfile
              multiline
              numberOfLines={10}
              onChangeText={(text) => setProfile(text)}
              value={profile}
            />
            <LBSMap value={"上海华东理工大学"} setStateFunc={setCouldSave} />
          </View>
        </View>
      ) : (
        <View>
          <Dialog.Loading />
        </View>
      )}
    </View>
  );
};
export default EditPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    // paddingTop: 10,
    padding: 15,
  },
  header: {
    // backgroundColor: "red",
    paddingTop: 50,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 18,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    // width: "80%",
  },
  disabledTextButton: {
    color: "#EE3B3B",
    opacity: 0.5,
    fontSize: 18,
    fontFamily: "serif",
  },
  TextButton: {
    color: "#EE3B3B",
    fontSize: 18,
    fontFamily: "serif",
  },
});
