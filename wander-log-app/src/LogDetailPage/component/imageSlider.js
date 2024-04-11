import { styled } from "@ui-kitten/components";
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
const config = require("../../../config.json");

const screenWidth = Dimensions.get("window").width;

const ImageSlider = ({ imageUrls }) => {
  const [maxRatio, setMaxRatio] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);

  // 计算图片的最大宽高比
  useEffect(() => {
    let maxRatio = 0;
    const fetchImagesSize = async () => {
      try {
        const sizes = await Promise.all(imageUrls.map(getImageSize));
        sizes.forEach(({ width, height }) => {
          const ratio = width / height;
          if (ratio > maxRatio) {
            maxRatio = ratio;
          }
        });
        setMaxRatio(maxRatio);
        // 根据最大比例对其他图片进行缩放
        const height = Dimensions.get("window").width / maxRatio;
        setContainerHeight(height);
      } catch (error) {
        console.error("Error fetching image sizes:", error);
      }
    };

    fetchImagesSize();
  }, [imageUrls]);

  // 获取图片的尺寸
  const getImageSize = async (url) => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        url,
        (width, height) => {
          resolve({ width, height });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const renderItem = ({ item }) => (
    <Image
      source={{ uri: item }}
      style={{ width: screenWidth, height: containerHeight }}
      resizeMode="contain"
    />
  );

  // 左右滑动改变圆点样式
  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const page = Math.floor((contentOffset.x + 1) / screenWidth);
    setCurrentPage(page);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={imageUrls}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        style={{ backgroundColor: "white" }}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.dotContainer}>
        {imageUrls.length > 1 &&
          imageUrls.length <= 6 &&
          imageUrls.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage ? styles.activeDot : null,
              ]}
            />
          ))}
        {/* {imageUrls.length > 6 && currentPage >= 5 && (
          <View style={styles.moreDots}>
            <View style={[styles.dot, styles.activeDot]} />
          </View> )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: "gray",
    marginHorizontal: 3,
    marginTop: 5,
  },
  activeDot: {
    backgroundColor: "red",
  },
  moreDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreDotsText: {
    color: "gray",
    fontSize: 12,
    marginLeft: 5,
  },
});

export default ImageSlider;
