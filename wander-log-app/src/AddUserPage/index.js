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
  Animated,
  TextInput,
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
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { api, getItemFromAS, removeValueFromAS } from "../../util";
import { color } from "@rneui/base";
const config = require("../../config.json");
const RenderItem = ({ value }) => {
  const navigation = useNavigation();
  const [focused, setFocused] = useState(false); // 当前用户是否点赞过该游记
  const [focusScaleValue] = useState(new Animated.Value(1));
  // console.log(value);
  const checkFocus = async () => {
    // console.log(userId, item._id);
    const response = await api.get(`/userInfo/checkFocus/${value.userId}`);
    setFocused(response.data.focused);
  };
  // 当前用户点赞或取消点赞该游记，数据库同步更新
  const handleFocus = async () => {
    const response = await api.post("/userInfo/focus", {
      beFollowedId: value.userId,
    });
    setFocused(response.data.focused);
  };
  // 点赞功能的点击效果
  const handleIconPress = () => {
    handleFocus();
    Animated.sequence([
      Animated.timing(focusScaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(focusScaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  useEffect(() => {
    checkFocus();
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("OtherUserLog", { userId: value.userId });
      }}
    >
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
              uri: value.userAvatar
                ? value.userAvatar
                : "https://randomuser.me/api/portraits/men/36.jpg",
            }}
          />
        </View>
        <View style={{ flex: 3, flexDirection: "column", marginLeft: 10 }}>
          <Text style={{ fontSize: 20 }}>{value.username}</Text>
          <View
            style={{
              padding: 5,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                borderRadius: 10,
                backgroundColor: "#ddd",
                padding: 5,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              {value.profile ? value.profile : 为世界的美好而战}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={handleIconPress}>
            <Text
              style={
                focused
                  ? sideMenuStyles.focusedButton
                  : sideMenuStyles.focusButton
              }
            >
              {focused ? "已关注" : "关注"}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Icon name="close"></Icon>
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AddUserScreen = () => {
  // const handleLoginOut = route.params;
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const countEachLoad = config.findUserCountEachLoad;
  const [searchInput, setSearchInput] = useState("");
  const [searchContent, setSearchContent] = useState("");

  const fetchUsers = async () => {
    try {
      const params = {
        searchContent: searchContent,
        count: countEachLoad,
        // offset: loadedCount,
      };
      const response = await api.get("/userInfo/findUsers", { params });
      // console.log(response.data.data);
      setData(response.data.data);
    } catch (e) {
      console.log(e);
      console.log(e.response.message);
    }
  };
  useEffect(() => {
    setData([]);
    fetchUsers();
  }, [searchContent]);
  const handleSearchPress = () => {
    // setLoadedCount(0);
    console.log(searchInput.trim());
    setSearchContent(searchInput.trim());
  };
  const handleInputChange = (input) => {
    setSearchInput(input);
  };
  const handleInputDelete = () => {
    setSearchInput("");
  };
  return (
    <View style={sideMenuStyles.container}>
      <View style={sideMenuStyles.searchBoxContainer}>
        <View style={sideMenuStyles.searchBox}>
          <Feather
            name="search"
            color="gray"
            size={20}
            style={sideMenuStyles.icon}
          />
          <TextInput
            style={sideMenuStyles.searchInput}
            placeholder="输入游客号或者用户名查询"
            onChangeText={handleInputChange}
            value={searchInput}
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={handleInputDelete}>
              <MaterialIcons
                name="cancel"
                size={24}
                color="#989797"
                style={sideMenuStyles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleSearchPress}>
          <Text style={sideMenuStyles.searchButton}>搜索</Text>
        </TouchableOpacity>
      </View>
      {data ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          numColumns={1}
          renderItem={({ item, index }) => (
            <View
              style={{ width: "100%", padding: 5, marginBottom: 10 }}
              key={index}
            >
              <RenderItem value={item} />
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
    backgroundColor: "#FFF",
    padding: 10,
  },
  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  searchBox: {
    flex: 9,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#eeeeee",
    borderRadius: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    fontSize: 16,
    marginLeft: 10,
    color: "gray",
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
  focusButton: {
    borderColor: "red",
    borderRadius: 30,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 5,
    color: "red",
  },
  focusedButton: {
    borderColor: "black",
    borderRadius: 30,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 5,
    color: "black",
  },
});
