import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const SearchBox = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter search keyword"
        onChangeText={setSearchText}
        value={searchText}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginTop: 40,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginRight: 10,
  },
});

export default SearchBox;
