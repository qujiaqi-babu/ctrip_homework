import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Dialog } from "@rneui/themed";
const config = require("../../config.json");
import {
  api,
  storeDataToAS,
  removeValueFromAS,
  getItemFromAS,
} from "../../util";

const MyMessagePage = () => {
  const [data, setData] = useState([]);
  // 每次加载countEachLoad个游记卡片
  const countEachLoad = config.countEachLoad;
  const [loadedCount, setLoadedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toTheEnd, setToTheEnd] = useState(false); // 是否到底了
  const navigation = useNavigation();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {
        limitCount: countEachLoad,
        skipCount: loadedCount,
      };
      const response = await api.get("/home/myMessages", { params });
      console.log(response.data);
      if (response.data.length === 0) {
        setToTheEnd(true); // 已经无法再获取新数据
      }
      const newData = [...data, ...response.data];
      setData(newData);
      const newLoadedCount = loadedCount + response.data.length;
      setLoadedCount(newLoadedCount);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // 游记卡片点击事件
  const handlePress = async (item) => {
    // 根据游记id获取作者id、昵称、头像
    // const response = await api.get(`/home/findAuthor/${item.id}`);
    // console.log(response.data);

    await api
      .get(`/home/findAuthor/${item.travelLogId}`)
      .then((response) => {
        console.log(response.data);
        const newItem = {
          ...response.data,
          _id: item.travelLogId,
        };
        navigation.navigate("LogDetail", {
          item: newItem,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.sharedTime}>{item.sharedTime}</Text>

      {/* xxx向你分享： */}
      <View style={styles.rowContainer}>
        <Avatar
          size={36}
          rounded
          source={{
            uri: item.fromUserAvatar,
          }}
        />
        <Text style={styles.fromUsername}>{item.fromUsername} 向你分享</Text>
      </View>

      {/* 游记卡片：第一张图片+标题 */}
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.card}>
          <Image
            source={{ uri: item.travelLogImageUrl }}
            style={styles.image}
          />
          <Text style={styles.travelLogTitle}>{item.travelLogTitle}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {data ? (
        <FlatList
          data={data}
          inverted={true}
          refreshing={loading}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={fetchMessages}
          onEndReachedThreshold={toTheEnd ? -0.5 : 0.5}
        />
      ) : (
        <Dialog.Loading />
      )}
    </View>
  );
};

const cardRadius = 15;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 30,
  },
  sharedTime: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  fromUsername: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: cardRadius,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderTopLeftRadius: cardRadius,
    borderTopRightRadius: cardRadius,
  },
  travelLogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 5,
  },
});

export default MyMessagePage;
