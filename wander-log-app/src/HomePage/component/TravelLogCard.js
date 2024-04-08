import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Text,
  Animated,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  api,
  storeDataToAS,
  removeValueFromAS,
  getItemFromAS,
} from "../../../util";

// 屏幕宽度
const screenWidth = Dimensions.get("window").width;

// 游记卡片
const TravelLogCard = ({ item, columnIndex, numColumns }) => {
  const [isRendered, setIsRendered] = useState(false);

  // 图片高度
  const [imageHeight, setImageHeight] = useState(200);

  const [likes, setLikes] = useState(item.likes); // 游记点赞量
  const [liked, setLiked] = useState(false); // 当前用户是否点赞过该游记
  const [likeScaleValue] = useState(new Animated.Value(1));

  // 获取导航对象
  const navigation = useNavigation();

  // 检查当前用户是否点赞过该游记
  const checkLike = async () => {
    const userInfo = await getItemFromAS("userInfo");
    // 将存储的 JSON 字符串转换为 JavaScript 对象
    const userId = JSON.parse(userInfo).userId;
    // console.log(userId, item._id);
    const response = await api.get(`/home/checkLike/${item._id}/${userId}`);
    setLiked(response.data.liked);
  };

  useEffect(() => {
    checkLike(); // 当前用户是否点赞过该游记
    Image.getSize(item.imageUrl, (width, height) => {
      // 计算图片在瀑布流中的高度;
      const newHeight = Math.floor((screenWidth / numColumns / width) * height);
      setImageHeight(newHeight);
    }).then(() => {
      setIsRendered(true);
    });
  }, []);

  const handlePress = () => {
    navigation.navigate("LogDetail", { item: item });
  };

  // 当前用户点赞或取消点赞该游记，数据库同步更新
  const handleLike = async () => {
    const userInfo = await getItemFromAS("userInfo");
    setLikes(liked ? likes - 1 : likes + 1);
    const response = await api.post("/home/like", {
      travelLogId: item._id,
      userId: JSON.parse(userInfo).userId,
    });
    setLiked(response.data.liked);
  };

  // 点赞功能的点击效果
  const handleIconPress = (type) => {
    handleLike();
    // setLiked(!liked);
    Animated.sequence([
      Animated.timing(likeScaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeScaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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
              source={{ uri: item.imageUrl }}
              style={{ ...styles.image, height: imageHeight }}
            />
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.rowContainer}>
              <View style={{ ...styles.rowContainer, flex: 1 }}>
                <Image
                  source={{ uri: item.userAvatar }}
                  style={styles.userAvatar}
                />
                <Text style={styles.userText}>{item.username}</Text>
              </View>
              <View style={{ ...styles.rowContainer, width: 60 }}>
                {/* <AntDesign
                  name="eyeo"
                  color="black"
                  size={styles.userAvatar.width}
                /> */}
                <TouchableOpacity onPress={() => handleIconPress("like")}>
                  <Animated.View
                    style={[{ transform: [{ scale: likeScaleValue }] }]}
                  >
                    <Ionicons
                      name={liked ? "heart" : "heart-outline"}
                      size={styles.userAvatar.width}
                      color={liked ? "red" : "black"}
                    />
                  </Animated.View>
                </TouchableOpacity>
                <Text style={styles.userText}>{likes}</Text>
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
