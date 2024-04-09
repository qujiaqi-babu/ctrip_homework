import "rn-overlay";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Overlay,
} from "react-native";
import WaterfallFlow from "react-native-waterfall-flow";
import TravelLogCard from "./component/TravelLogCard";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { api, setAuthHeader } from "../../util";
const config = require("../../config.json");

const Toast = Overlay.Toast;

const RequestStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const HomePage = ({ navigation }) => {
  // 瀑布流列数
  const [numColumns, setNumColumns] = useState(2);
  const topics = ["", ...config.topic];

  // 每次瀑布流加载countEachLoad个游记卡片
  const countEachLoad = config.countEachLoad;
  const [travelLogs, setTravelLogs] = useState([]);
  // const [loadedCount, setLoadedCount] = useState(0);

  const [searchContent, setSearchContent] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const [requestStatus, setRequestStatus] = useState(RequestStatus.IDLE);

  // 获取游记列表
  const fetchTravelLog = async (type) => {
    try {
      const params = {
        selectedTopic: selectedTopic,
        searchContent: searchContent,
        count: countEachLoad,
        // offset: loadedCount,
      };
      const response = await api.get("/home/travelLogs", { params });
      type === "fresh"
        ? setTravelLogs(response.data) // 刷新游记
        : setTravelLogs([...travelLogs, ...response.data]); // 增量获取
      // console.log(response.data);
      // 数据加载成功
      setRequestStatus(RequestStatus.SUCCESS);
    } catch (error) {
      // 数据加载失败
      setRequestStatus(RequestStatus.ERROR);
    }
  };

  useEffect(() => {
    // 等待容器加载数据
    setAuthHeader();
    setRequestStatus(RequestStatus.PENDING);
    fetchTravelLog("append");
  }, [searchContent, selectedTopic]);

  // 当滚动到顶部时刷新游记列表
  const handleFresh = async () => {
    setRequestStatus(RequestStatus.PENDING);
    setTravelLogs([]);
    await fetchTravelLog("fresh");
  };

  // 分中英文计算字符长度
  const calculateLength = (str) => {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      // 检查是否是中文字符，如果是，则计数+2，否则+1
      const charCode = str.charCodeAt(i);
      if (charCode >= 0x4e00 && charCode <= 0x9fff) {
        length += 1; // 中文字符
      } else {
        length += 0.5; // 英文字符
      }
    }
    return length;
  };

  const maxInputLength = 20;

  const handleInputChange = (input) => {
    const length = calculateLength(input);
    if (length <= maxInputLength) {
      setSearchInput(input);
    } else {
      Toast.show(`标题长度不能超过${maxInputLength}个字符`);
    }
  };

  const handleInputDelete = () => {
    setSearchInput("");
  };

  const handleSearchPress = () => {
    // setLoadedCount(0);
    setTravelLogs([]);
    setSearchContent(searchInput);
  };

  const handleTopicPress = (index) => {
    // setLoadedCount(0);
    setTravelLogs([]);
    setSelectedTopic(topics[index]);
    setSearchContent("");
    setSearchInput("");
  };

  return (
    <View style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" color="gray" size={20} style={styles.icon} />
          <TextInput
            style={styles.searchInput}
            // placeholder="Enter search keyword"
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

      {/* 主题滚动条 */}
      <View style={styles.topicScrollContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {topics.map((topic, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTopicPress(index)}
            >
              <Text
                style={[
                  styles.topic,
                  topic === selectedTopic && styles.selectedTopic,
                ]}
              >
                {topic ? topic : "推荐"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 数据加载页 */}
      {/* {requestStatus === RequestStatus.PENDING && (
        <Text style={styles.loading}>游记列表加载中... ^o^</Text>
      )} */}

      {/* 游记卡片瀑布流 */}
      {(requestStatus === RequestStatus.PENDING ||
        requestStatus === RequestStatus.SUCCESS) && (
        <WaterfallFlow
          style={styles.waterfallFlow}
          data={travelLogs}
          onRefresh={handleFresh}
          refreshing={requestStatus === RequestStatus.PENDING}
          onEndReached={() => {
            fetchTravelLog("append");
          }}
          onEndReachedThreshold={0.1}
          numColumns={numColumns}
          renderItem={({ item, index, columnIndex }) => (
            <TravelLogCard
              key={index}
              item={item}
              columnIndex={columnIndex}
              numColumns={numColumns}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 55,
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

  topicScrollContainer: {
    marginVertical: 5,
  },
  topic: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: 16,
    color: "gray",
  },
  selectedTopic: {
    fontWeight: "bold",
    color: "#3498DB",
    borderBottomWidth: 2,
    borderBottomColor: "#3498DB",
  },

  waterfallFlow: {
    backgroundColor: "#f0f0f0",
  },
  loading: {
    flex: 1,
  },
});

export default HomePage;
