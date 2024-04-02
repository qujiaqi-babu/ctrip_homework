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

const Toast = Overlay.Toast;

// 游记数据
const imageList = [
  "https://th.bing.com/th/id/R.63041927f4a82c69be9154fe7be5dcd8?rik=rEmOJUuEAW8hPQ&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f22%2f1522.jpg&ehk=yPnRjbJRaymFBmY2UhpFn2DPanf0HBpPLctjo3h3vRA%3d&risl=&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/R.6b5df1bfe0e4778a44dba0753cd169c8?rik=QRQIMqvjWRCO5Q&riu=http%3a%2f%2fpic39.nipic.com%2f20140321%2f8857347_232251363165_2.jpg&ehk=7oAaMo6LCHJc%2bqpQ0IPvcH7v69jGRQhb2vDz%2fOd5720%3d&risl=&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/R.b61e85948514dde6c8f2997871c60766?rik=WSmrFRL1fzIM2A&riu=http%3a%2f%2fpic1.bbzhi.com%2ffengjingbizhi%2fdiqiuguibaodachicunziranfengjingbizhijingxuandiyiji%2fnature_2008_landscape_1680_desktop_01_20183_11.jpg&ehk=UHw5ouJjdlJ4utvTAdWd8UZTuIpkI%2fMSeyoP%2fjtTbpQ%3d&risl=&pid=ImgRaw&r=0",
];

const topicList = [
  "推荐",
  "亲子",
  "情侣",
  "美食",
  "购物",
  "自然",
  "topic1",
  "topic2",
  "topic3",
  "topic4",
  "topic5",
];

const initalTravelLogs = [];
const sampleNum = 100;
for (let i = 0; i < sampleNum; i++) {
  initalTravelLogs.push({
    id: `${i}`,
    title: `Title ${i}`,
    image: imageList[i % 3],
    userAvatar: imageList[i % 3],
    userName: `User ${i}`,
    clickCount: 200,
    topic: topicList[i % topicList.length],
  });
}

const RequestStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const HomePage = ({ navigation }) => {
  // 瀑布流列数
  const [numColumns, setNumColumns] = useState(2);
  const [travelLogs, setTravelLogs] = useState(initalTravelLogs);
  const [searchContent, setSearchContent] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(topicList[0]);

  const [requestStatus, setRequestStatus] = useState(RequestStatus.IDLE);

  // 通过 fetch 走本地 json 数据获取游记列表
  const forkFetch = () => {
    return new Promise((resolve) => {
      // 假设请求返回最新的数据
      const newTravelLogs = initalTravelLogs.filter(
        (log) =>
          log.title.includes(searchContent) && log.topic === selectedTopic
      );
      // 模拟网络延时
      setTimeout(() => {
        resolve(newTravelLogs);
      }, 1 * 1000);
    });
  };

  useEffect(() => {
    // 等待容器加载数据
    setRequestStatus(RequestStatus.PENDING);
    forkFetch()
      .then((newTravelLogs) => {
        setTravelLogs(newTravelLogs);
        // 数据加载成功
        setRequestStatus(RequestStatus.SUCCESS);
      })
      .catch(() => {
        // 数据加载失败
        setRequestStatus(RequestStatus.ERROR);
      });
  }, [searchContent, selectedTopic]);

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
    setSearchContent(searchInput);
  };

  const handleTopicPress = (index) => {
    setSelectedTopic(topicList[index]);
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
          {topicList.map((topic, index) => (
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
                {topic}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 数据加载页 */}
      {requestStatus === RequestStatus.PENDING && (
        <Text style={styles.loading}>游记列表加载中... ^o^</Text>
      )}

      {/* 游记卡片瀑布流 */}
      {requestStatus === RequestStatus.SUCCESS && (
        <WaterfallFlow
          style={styles.waterfallFlow}
          data={travelLogs}
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
