import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  AntDesign,
  Octicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ImageSlider from "./component/imageSlider";

const LogDetailPage = () => {
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

  const images = [
    "https://pic1.zhimg.com/50/v2-e814c1e763ea9e1d996426a24901d2ad_hd.jpg?source=1940ef5c",
    "https://pic1.zhimg.com/v2-19989b3136b39a0cc9379c29babbd3f2_r.jpg?source=1940ef5c",
    "https://ts1.cn.mm.bing.net/th/id/R-C.08edbf54f0ac46c135bf4f4d777dc16a?rik=9saq7P38Oq2Gfw&riu=http%3a%2f%2fwww.people.com.cn%2fmediafile%2fpic%2f20170411%2f33%2f11988651533966682221.jpg&ehk=G%2fRSTCp7gBimJXBm9kDpdP2PwavXVAg3MbuluFbhGb0%3d&risl=&pid=ImgRaw&r=0",
    "https://pic1.zhimg.com/50/v2-86c2d637bfbc6074a9cced94d8983a75_hd.jpg?source=1940ef5c",
    "https://pic2.zhimg.com/v2-0dda71bc9ced142bf7bb2d6adbebe4f0_r.jpg?source=1940ef5c",
    "https://tse3-mm.cn.bing.net/th/id/OIP-C.LqD3h9bP0iU4Tu7ckbcGRgHaHa?rs=1&pid=ImgDetMain",
  ];

  // 点击昵称或者头像可进入该用户主页
  const handleGoToMyPage = () => {
    navigation.navigate("MyLogPage");
  };

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
          <TouchableOpacity style={styles.userInfo} onPress={handleGoToMyPage}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../LogPublicPage/1.jpg")}
                style={styles.avatar}
              />
            </View>
            <View style={styles.nickName}>
              <Text style={styles.nameText}>哈哈豆包</Text>
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
        <ImageSlider imageUrls={images} />
        <Text style={styles.titleText}>笔记标题</Text>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.labelBox}>
            <View style={styles.label}>
              <Text style={styles.labelText}>地点</Text>
              <Text style={styles.labelData}>xx</Text>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelText}>出行月份</Text>
              <Text style={styles.labelData}>x月</Text>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelText}>人均花费</Text>
              <Text style={styles.labelData}>1-2k</Text>
            </View>
            <View style={[styles.label, { marginRight: 10 }]}>
              <Text style={styles.labelText}>推荐指数</Text>
              <Text style={[styles.labelData, { color: "#F5B041" }]}>3.5</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.contentText}>笔记内容</Text>
        </View>
        <View
          style={{ height: 1, backgroundColor: "#D1CFCF", marginVertical: 10 }}
        ></View>
        <View>
          <Text style={styles.contentText}>评论区</Text>
        </View>
      </ScrollView>

      {/* 底部导航栏 */}
      <View style={styles.topScreen}>
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
  },
});

export default LogDetailPage;
