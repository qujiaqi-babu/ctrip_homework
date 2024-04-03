import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const MonthPicker = ({ onSelectMonth }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const months = [
    { id: 1, name: "一月" },
    { id: 2, name: "二月" },
    { id: 3, name: "三月" },
    { id: 4, name: "四月" },
    { id: 5, name: "五月" },
    { id: 6, name: "六月" },
    { id: 7, name: "七月" },
    { id: 8, name: "八月" },
    { id: 9, name: "九月" },
    { id: 10, name: "十月" },
    { id: 11, name: "十一月" },
    { id: 12, name: "十二月" },
  ];

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    onSelectMonth(month);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMonthSelect(item.name)}>
      <Text
        style={[
          styles.monthItem,
          {
            backgroundColor:
              selectedMonth === item.name ? "light-gray" : "transparent",
          },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={months}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}  // 隐藏滑动栏
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthItem: {
    padding: 5,
    margin: 5,
    fontSize: 16,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});

export default MonthPicker;
