import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, ScrollView } from "react-native";
import WaterfallFlow from "react-native-waterfall-flow";
import TravelLogCard from "./component/TravelLogCard";
import SearchBox from "./component/SearchBox";
import HorizontalTopicScroll from "./component/HorizontalTopicScroll";

// 游记数据
const imageList = [
  "https://th.bing.com/th/id/R.63041927f4a82c69be9154fe7be5dcd8?rik=rEmOJUuEAW8hPQ&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f22%2f1522.jpg&ehk=yPnRjbJRaymFBmY2UhpFn2DPanf0HBpPLctjo3h3vRA%3d&risl=&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/R.6b5df1bfe0e4778a44dba0753cd169c8?rik=QRQIMqvjWRCO5Q&riu=http%3a%2f%2fpic39.nipic.com%2f20140321%2f8857347_232251363165_2.jpg&ehk=7oAaMo6LCHJc%2bqpQ0IPvcH7v69jGRQhb2vDz%2fOd5720%3d&risl=&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/R.b61e85948514dde6c8f2997871c60766?rik=WSmrFRL1fzIM2A&riu=http%3a%2f%2fpic1.bbzhi.com%2ffengjingbizhi%2fdiqiuguibaodachicunziranfengjingbizhijingxuandiyiji%2fnature_2008_landscape_1680_desktop_01_20183_11.jpg&ehk=UHw5ouJjdlJ4utvTAdWd8UZTuIpkI%2fMSeyoP%2fjtTbpQ%3d&risl=&pid=ImgRaw&r=0",
];

const HomePage = ({ navigation }) => {
  const initalTravelLogs = [];
  const sampleNum = 20;
  for (let i = 0; i < sampleNum; i++) {
    initalTravelLogs.push({
      id: `${i}`,
      title: `Title ${i}`,
      image: imageList[i % 3],
      userAvatar: imageList[i % 3],
      userName: `User ${i}`,
      clickCount: 100,
    });
  }

  const topicList = [
    { topic: "推荐", status: true },
    { topic: "亲子", status: false },
    { topic: "情侣", status: false },
    { topic: "美食", status: false },
    { topic: "购物", status: false },
    { topic: "自然", status: false },
  ];

  // 瀑布流列数
  const [numColumns, setNumColumns] = useState(2);
  const [travelLogs, setTravelLogs] = useState(initalTravelLogs);
  const [searchContent, setSearchContent] = useState("");
  const [topicStatus, setTopicStatus] = useState(topicList);

  // 主题点击事件
  const handleTopicPress = (index) => {
    const newTopicStatus = topicStatus.forEach((item, i) => {
      if (i === index) {
        item.status = !item.status;
      } else {
        item.status = false;
      }
    });
    setTopicStatus(newTopicStatus);
  };

  return (
    <View style={styles.container}>
      <SearchBox />
      {numColumns === 2 && (
        <Button title="单栏" onPress={() => setNumColumns(3 - numColumns)} />
      )}
      {numColumns === 1 && (
        <Button title="双栏" onPress={() => setNumColumns(3 - numColumns)} />
      )}
      {/* <HorizontalTopicScroll
        topicList={topicStatus}
        handleTopicPress={handleTopicPress}
      /> */}

      <WaterfallFlow
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
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
});

export default HomePage;
