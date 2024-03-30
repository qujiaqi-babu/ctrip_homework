import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
const DropdownComponent = () => {
  const [selectedValue, setSelectedValue] = useState("java");
  const [selectedValue2, setSelectedValue2] = useState("java");

  return (
    <View style={{ flexDirection: "row", backgroundColor: "#eee" }}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        style={styles.picker}
        prompt="Select one option"
        mode="dropdown"
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Python" value="python" />
        <Picker.Item label="Ruby" value="ruby" />
        <Picker.Item label="C++" value="cpp" />
      </Picker>
      <Picker
        selectedValue={selectedValue2}
        onValueChange={(itemValue, itemIndex) => setSelectedValue2(itemValue)}
        style={styles.picker}
        prompt="Select one option"
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Python" value="python" />
        <Picker.Item label="Ruby" value="ruby" />
        <Picker.Item label="C++" value="cpp" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    margin: 8,
  },
});

export default DropdownComponent;
