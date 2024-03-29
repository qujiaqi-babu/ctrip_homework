import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

const HorizontalTopicScroll = ({
  topicList,
  selectedTopic,
  setSelectedTopic,
}) => {
  const handlePress = (index) => {
    setSelectedTopic(topicList[index]);
  };

  return (
    <View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {topicList.map((topic, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => handlePress(index)}
          >
            <Text
              style={[
                styles.topic,
                topic === selectedTopic && styles.selectedTopic,
              ]}
            >
              {topic}
            </Text>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topic: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  selectedTopic: {
    fontWeight: "bold",
    color: "#0072c6",
    borderBottomWidth: 2,
    borderBottomColor: "#0072c6",
  },
});

export default HorizontalTopicScroll;
