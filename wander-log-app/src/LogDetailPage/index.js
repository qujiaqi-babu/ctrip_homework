import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
} from "react-native";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ImageSlider from "./component/imageSlider";
import { api, getItemFromAS } from "../../util";

const LogDetailPage = ({ route }) => {
  const { item } = route.params; // 主页传来的值
  const logId = item._id;
  const userId = item.userId;
  const userAvatar = item.userAvatar;
  // console.log(userAvatar);
  const userName = item.username;

  const navigation = useNavigation();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [collected, setCollected] = useState(false);
  const [collects, setCollects] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(0);
  const [likeScaleValue] = useState(new Animated.Value(1));
  const [collectScaleValue] = useState(new Animated.Value(1));

  const [travelLog, setTravelLog] = useState(null);

  // 调整数据格式
  const mapPerCost = (cost) => {
    if (cost === "500—1000") {
      return "500-1k";
    } else if (cost === "1000—2000") {
      return "1k-2k";
    } else if (cost === "2000以上") {
      return "2k+";
    } else {
      return cost;
    }
  };

  const mapRate = (rate) => {
    return parseFloat(rate).toFixed(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // console.log("fetching log detail...");
    const fetchLogDetail = async () => {
      try {
        const response = await api.get(`/logDetail/findLog/${logId}`);
        const data = await response.data;
        setTravelLog({
          ...travelLog,
          imagesUrl: data.imagesUrl,
          title: data.title,
          destination: data.destination,
          month: data.travelMonth,
          perCost: mapPerCost(data.percost),
          recomRate: mapRate(data.rate),
          content: data.content,
          topic: data.topic,
          editTime: formatDate(data.editTime),
          favorites: data.favorites,
          hits: data.hits,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchLogDetail();
  }, []);

  // 关注用户功能
  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  // 评论功能
  const handleCommentSubmit = () => {
    console.log("提交评论:", comment);
    setComment("");
    setComments(comments + 1);
    setModalVisible(false);
  };

  // 点赞功能的点击效果
  const handleIconPress = (type) => {
    if (type === "like") {
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
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
    } else if (type === "collect") {
      setCollected(!collected);
      setCollects(collected ? collects - 1 : collects + 1);
      Animated.sequence([
        Animated.timing(collectScaleValue, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(collectScaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 顶部导航栏 */}
      <View style={styles.topScreen}>
        <View style={styles.leftTopScreen}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios"
              size={30}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={async () => {
              let user = await getItemFromAS("userInfo");
              user = JSON.parse(user);
              if (user.userId && user.userId == userId) {
                // navigation.goBack();
                navigation.navigate("MyLog");
              } else {
                navigation.navigate("OtherUserLog", { userId: userId });
              }
            }}
          >
            {/* 根据传过来的用户Id进行查找，跳到对应的id用户界面 */}
            <View style={styles.avatarContainer}>
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            </View>
            <View style={styles.nickName}>
              <Text style={styles.nameText}>
                {userName ? userName : "空的昵称"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.leftTopScreen}>
          <TouchableOpacity
            style={[styles.subscribe, isSubscribed && styles.subscribed]}
            onPress={handleSubscribe}
          >
            <Text
              style={[
                styles.subscribeText,
                isSubscribed && styles.subscribedText,
              ]}
            >
              {isSubscribed ? "已关注" : "关注"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons
              name="ios-share"
              size={30}
              style={{ marginRight: 10, color: "#566573" }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 中间的滚动视图 */}
      <ScrollView style={{ flex: 1 }}>
        {travelLog && <ImageSlider imageUrl={travelLog.imagesUrl} />}
        {travelLog && <Text style={styles.titleText}>{travelLog.title}</Text>}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.labelBox}>
            <View style={styles.label}>
              <Text style={styles.labelText}>地点</Text>
              {travelLog && (
                <Text style={styles.labelData}>
                  {travelLog.destination ? travelLog.destination : "xx"}
                </Text>
              )}
            </View>
            <View style={styles.label}>
              <Text style={styles.labelText}>出行月份</Text>
              {travelLog && (
                <Text style={styles.labelData}>{travelLog.month}</Text>
              )}
            </View>
            <View style={styles.label}>
              <Text style={styles.labelText}>人均花费</Text>
              {travelLog && (
                <Text style={styles.labelData}>{travelLog.perCost}</Text>
              )}
            </View>
            <View style={[styles.label, { marginRight: 10 }]}>
              <Text style={styles.labelText}>推荐指数</Text>
              {travelLog && (
                <Text style={[styles.labelData, { color: "#F5B041" }]}>
                  {travelLog.recomRate}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          {travelLog && (
            <Text style={styles.contentText}>{travelLog.content}</Text>
          )}
        </View>
        <View style={{ marginTop: 10 }}>
          {travelLog && (
            <Text style={styles.editTime}>{travelLog.editTime}</Text>
          )}
        </View>
        <View
          style={{ height: 1, backgroundColor: "#D1CFCF", marginVertical: 10 }}
        ></View>
        <View>
          <Text style={styles.contentText}>评论区</Text>
        </View>
      </ScrollView>

      {/* 底部导航栏 */}
      <View style={styles.bottomScreen}>
        <View style={styles.leftBottomScreen}>
          <TouchableOpacity
            style={styles.commentBox}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ marginLeft: 20, fontSize: 16, color: "#808B96" }}>
              说点什么吧~
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.commentInput}>
                <TextInput
                  placeholder="请输入评论"
                  value={comment}
                  onChangeText={(text) => setComment(text)}
                  style={styles.input}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
              <TouchableOpacity
                onPress={handleCommentSubmit}
                style={styles.submitBtn}
              >
                <Text style={{ color: "white", fontSize: 18 }}>发 送</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.rightBottomScreen}>
          <TouchableOpacity onPress={() => handleIconPress("like")}>
            <Animated.View style={[{ transform: [{ scale: likeScaleValue }] }]}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={32}
                color={liked ? "red" : "black"}
              ></Ionicons>
            </Animated.View>
          </TouchableOpacity>
          <Text style={{ marginLeft: 5 }}>{likes}</Text>
          <TouchableOpacity
            onPress={() => handleIconPress("collect")}
            style={{ marginLeft: 10 }}
          >
            <Animated.View
              style={[{ transform: [{ scale: collectScaleValue }] }]}
            >
              <AntDesign
                name={collected ? "star" : "staro"}
                size={32}
                color={collected ? "#F5B041" : "black"}
              ></AntDesign>
            </Animated.View>
          </TouchableOpacity>
          <Text style={{ marginLeft: 5 }}>{collects}</Text>
          <TouchableOpacity style={{ marginLeft: 10 }}>
            {/* 点击事件，点击消息icon可以定位到评论区的开头 */}
            <AntDesign name="message1" size={28} />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5 }}>{comments}</Text>
          {/* comments的数量与评论的数量一致 */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topScreen: {
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
  },
  leftTopScreen: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBlockColor: "#D5D8DC",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nickName: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 16,
  },
  subscribe: {
    marginRight: 10,
    width: 60,
    height: 30,
    borderWidth: 1,
    borderColor: "#E74C3C",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  subscribed: {
    borderColor: "#D5D8DC",
    width: 70,
  },
  subscribeText: {
    fontSize: 14,
    color: "#E74C3C",
  },
  subscribedText: {
    color: "#566573",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: "50%",
  },
  commentInput: {
    width: "100%",
    height: 160,
    backgroundColor: "#F5F7FA",
    borderRadius: 20,
    marginTop: 20,
  },
  input: {
    padding: 10,
    fontSize: 18,
    textAlignVertical: "top",
  },
  submitBtn: {
    width: 80,
    height: 40,
    backgroundColor: "#3498DB",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  leftBottomScreen: {
    marginLeft: 10,
  },
  commentBox: {
    width: 200,
    height: 40,
    backgroundColor: "#F5F7FA",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  rightBottomScreen: {
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    height: 800,
  },
  titleText: {
    fontSize: 22,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  labelBox: {
    width: "98%",
    height: 80,
    borderRadius: 20,
    backgroundColor: "#D4E6F1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  labelText: {
    fontSize: 16,
    color: "#808B96",
  },
  labelData: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
  contentText: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "left",
    marginTop: 10,
  },
  editTime: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "left",
    color: "#808B96",
  },
  bottomScreen: {
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default LogDetailPage;
