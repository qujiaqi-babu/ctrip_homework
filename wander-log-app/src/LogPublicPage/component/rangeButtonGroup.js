import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const RangeButtonGroup = ({ ranges, selectedRange, onPress }) => {
  return (
    <View style={styles.container}>
      {ranges.map((range, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.rangeButton,
            selectedRange === range && styles.selectedRangeButton,
          ]}
          onPress={() => onPress(range)}
        >
          <Text>{range}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rangeButton: {
    width: 100,
    height: 35,
    backgroundColor: "#E3E6E8",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    marginRight: 5,
  },
  selectedRangeButton: {
    borderColor: "#52BE80",
    backgroundColor: "#DEE4DC",
    borderWidth: 1,
  },
});

export default RangeButtonGroup;
