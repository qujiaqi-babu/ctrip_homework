import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

// 屏幕宽度
const screenWidth = Dimensions.get("window").width;

// 游记卡片
const TravelLogCard = ({ item, columnIndex, numColumns }) => {
  const [isRendered, setIsRendered] = useState(false);

  // 图片高度
  const [imageHeight, setImageHeight] = useState(200);
  // 获取导航对象
  const navigation = useNavigation();

  // const getImageSizeAsync = (imageUrl) => {
  //   return new Promise((resolve, reject) => {
  //     Image.getSize(
  //       imageUrl,
  //       (width, height) => {
  //         resolve({ width, height });
  //       },
  //       reject
  //     );
  //   });
  // };
  // const loadImageAndCalculateHeight = async (itemImage) => {
  //   try {
  //     const { width, height } = await getImageSizeAsync(itemImage);
  //     const newHeight = Math.floor((screenWidth / numColumns / width) * height);
  //     setImageHeight(newHeight);
  //     setIsRendered(true);
  //   } catch (error) {
  //     console.error("Error loading image:", error);
  //   }
  // };

  useEffect(() => {
    Image.getSize(item.image, (width, height) => {
      // 计算图片在瀑布流中的高度;
      const newHeight = Math.floor((screenWidth / numColumns / width) * height);
      setImageHeight(newHeight);
    });
    setIsRendered(true);

    // 调用异步函数
    // loadImageAndCalculateHeight(item.image);
  }, []);

  const handlePress = () => {
    navigation.navigate("LogDetail");
  };

  return (
    <View>
      {isRendered && (
        <TouchableWithoutFeedback onPress={handlePress}>
          <View
            style={
              numColumns === 1
                ? styles.card
                : {
                    ...styles.card,
                    marginLeft: columnIndex === 0 ? 8 : 4,
                    marginRight: columnIndex === 0 ? 4 : 8,
                  }
            }
          >
            <Image
              source={{ uri: item.image }}
              style={{ ...styles.image, height: imageHeight }}
            />
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.rowContainer}>
              <View style={{ ...styles.rowContainer, flex: 1 }}>
                <Image
                  source={{ uri: item.userAvatar }}
                  style={styles.userAvatar}
                />
                <Text style={styles.userText}>{item.userName}</Text>
              </View>
              <View style={{ ...styles.rowContainer, width: 60 }}>
                <AntDesign
                  name="eyeo"
                  color="black"
                  size={styles.userAvatar.width}
                />
                <Text style={styles.userText}>{item.clickCount}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const borderRadius = 4;

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    marginHorizontal: 8,
    borderRadius: borderRadius,
    backgroundColor: "white",
  },
  image: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingBottom: 2,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingBottom: 2,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  userText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default TravelLogCard;
