import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button } from "@rneui/themed";

const LogPublicPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topBottom}></View>
      {/*顶部放导航栏的地方*/}
      <View style={styles.one}>
        <View style={styles.imageContainer}>
          <Image source={require("./1.jpg")} style={styles.image} />
        </View>
        <View style={styles.imageContainer}>
          <Button
            title="+"
            disabled
            containerStyle={{ weight: 100 }} // 有问题
          />
        </View>
      </View>
      <View style={styles.two}></View>
      <View style={styles.three}></View>
      <View style={styles.four}></View>
      <View style={styles.five}></View>
      <View style={styles.six}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 10,
    marginRight: 10,
  },
  topBottom: {
    flex: 1,
    backgroundColor: "gray",
  },
  one: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  two: {
    flex: 1,
    backgroundColor: "green",
  },
  three: {
    flex: 4,
    backgroundColor: "yellow",
  },
  four: {
    flex: 3,
    backgroundColor: "orange",
  },
  five: {
    flex: 1,
    backgroundColor: "purple",
  },
  six: {
    flex: 3,
    backgroundColor: "gray",
  },
});

export default LogPublicPage;
