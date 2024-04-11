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

const AddLocationPage = ({ route }) => {
  const setFunc = route.params.setFunc;
  let oldValue = "";

  const navigation = useNavigation();
  const [couldSave, setCouldSave] = useState(false);
  const [data, setData] = useState({});
  const value = route.params.value;
  if (value) {
    // console.log(value);
    oldValue = value;
  }

  const handleSave = () => {
    navigation.goBack();
  };

  //   useEffect(() => {}, [oldValue]);
  return (
    <View style={{ flex: 1 }}>
      {data ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                setFunc(oldValue);

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
            <LBSMap
              value={oldValue}
              setValueFunc={setFunc}
              setStateFunc={setCouldSave}
            />
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
export default AddLocationPage;
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
