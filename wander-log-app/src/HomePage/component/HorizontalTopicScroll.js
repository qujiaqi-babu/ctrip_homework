import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

const HorizontalTopicScroll = ({ topicList, handleTopicPress }) => {
  return (
    <ScrollView horizontal={true} style={styles.scrollView}>
      {topicList.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.topic, item.status && styles.selectedTopic]}
          onPress={() => handleTopicPress(index)}
        >
          <Text style={styles.topicText}>{item.topic}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row", // 设置水平排列
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  topic: {
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  selectedTopic: {
    backgroundColor: "lightblue",
  },
  topicText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HorizontalTopicScroll;
