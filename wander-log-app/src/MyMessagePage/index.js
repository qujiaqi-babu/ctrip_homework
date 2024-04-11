import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // fetchMessages();
  }, []);

  const fetchData = () => {
    // Simulated fetching data from an API
    setLoading(true);
    setTimeout(() => {
      const newData = generateData(page);
      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    }, 1000);
  };

  const fetchMessages = async () => {
    try {
      const params = {
        count: countEachLoad,
        offset: loadedCount,
      };
      const response = await api.get("/home/myMessages", { params });
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

  const generateData = (page) => {
    // Simulated data generation
    const newData = [];
    for (let i = 1; i <= 10; i++) {
      newData.push({
        id: (page - 1) * 10 + i,
        sharedTime: `Shared ${Math.floor(Math.random() * 24)} hours ago`,
        image: `https://example.com/image${Math.floor(Math.random() * 10)}.jpg`,
      });
    }
    return newData;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.sharedTime}>{item.sharedTime}</Text>
      <Image source={{ uri: item.image }} style={styles.image} />
    </View>
  );

  return (
    <FlatList
      data={data}
      inverted={true}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={fetchData}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading && <ActivityIndicator size="large" color="#0000ff" />
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  sharedTime: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
});

export default MyMessagePage;
