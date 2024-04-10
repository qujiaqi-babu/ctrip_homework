import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import { Avatar, Dialog } from "@rneui/themed";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { api } from "../../util";

const RenderItem = ({ value, handleFriendPress }) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(value.selected); // 当前用户是否勾选了该好友
  const [selectScaleValue] = useState(new Animated.Value(1));

  // console.log(value.username, value.selected, selected);

  // 当组件的传入值发生变化，更新其选中状态（重要！！！）
  useEffect(() => {
    setSelected(value.selected);
  }, [value]);

  // 勾选按钮的点击效果
  const handleIconPress = () => {
    handleFriendPress(value.userId);
    setSelected(!selected);
    Animated.sequence([
      Animated.timing(selectScaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(selectScaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.rowContainer}>
      <TouchableOpacity onPress={handleIconPress} style={styles.checkIcon}>
        <Animated.View style={[{ transform: [{ scale: selectScaleValue }] }]}>
          <Feather
            name={selected ? "check-circle" : "circle"}
            size={24}
            color={selected ? "#3498DB" : "black"}
          />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("OtherUserLog", { userId: value.userId });
        }}
        style={styles.rowCard}
      >
        <Avatar
          size={64}
          rounded
          source={{
            uri: value.userAvatar
              ? value.userAvatar
              : "https://randomuser.me/api/portraits/men/36.jpg",
          }}
        />
        <View style={styles.columnContainer}>
          <Text style={{ fontSize: 20, paddingBottom: 5 }}>
            {value.username}
          </Text>
          <Text
            style={{
              fontSize: 15,
              paddingBottom: 5,
            }}
          >
            {value.profile ? value.profile : "为世界的美好而战"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchContent, setSearchContent] = useState("");

  const fetchFriends = async () => {
    try {
      const params = {
        searchContent: searchContent,
      };
      const response = await api.get("/home/myFriends", { params });
      // const myFriends = response.data;
      const myFriends = response.data.map((item) => ({
        ...item,
        selected: selectedFriends
          ? selectedFriends.includes(item.userId)
          : false,
      }));
      // console.log(myFriends);
      setFriends(myFriends);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [searchContent]);

  const handleSearchPress = () => {
    console.log(searchInput.trim());
    setSearchContent(searchInput.trim());
  };
  const handleInputChange = (input) => {
    setSearchInput(input);
  };
  const handleInputDelete = () => {
    setSearchInput("");
  };

  // 勾选/取消勾选该好友
  const handleFriendPress = (friendId) => {
    // 更新好友列表选中状态
    const updatedFriends = friends.map((friend) =>
      friend.userId === friendId
        ? { ...friend, selected: !friend.selected }
        : friend
    );
    setFriends(updatedFriends);
    // 更新被选中的好友列表
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(
        selectedFriends.filter((userId) => userId !== friendId)
      );
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
    // console.log(selectedFriends);
  };

  // 当前用户分享该游记，数据库同步更新
  const handleSharePress = async () => {
    console.log("分享给选定的好友:", selectedFriends);
    // const response = await api.post("/home/share", {
    //   beFollowedId: value.userId,
    // });
    // setFocused(response.data.focused);
  };

  return (
    <View style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" color="gray" size={20} style={styles.icon} />
          <TextInput
            style={styles.searchInput}
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
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleSearchPress}>
          <Text style={styles.searchButton}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* 好友列表 */}
      {friends ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={friends}
          numColumns={1}
          renderItem={({ item, index }) => (
            <RenderItem value={item} handleFriendPress={handleFriendPress} />
          )}
        ></FlatList>
      ) : (
        <Dialog.Loading />
      )}
      {selectedFriends.length > 0 && (
        <TouchableOpacity onPress={handleSharePress} style={styles.shareButton}>
          <Text style={styles.shareText}>分享</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },

  // 搜索框
  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
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

  // 好友列表
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 8,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  checkIcon: {
    marginHorizontal: 10,
  },
  rowCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
  },

  // 分享按钮
  shareButton: {
    backgroundColor: "#3498DB",
    borderRadius: 30,
    padding: 10,
    marginTop: 10,
  },
  shareText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});

export default FriendList;
