import "rn-overlay";
import { Overlay, ScrollView } from "react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Button } from "@rneui/themed";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import MonthPicker from "./component/monthPicker";
import RangeButtonGroup from "./component/rangeButtonGroup";
import StarRating from "./component/starRating";

const Toast = Overlay.Toast;

const LogPublicPage = () => {
  const [title, setTitle] = useState("");
  const maxTitleLength = 20;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const ranges = ["0—500", "500—1000", "1000—2000", "2000以上"];
  const [rating, setRating] = useState(0);

  // 返回事件
  const handleEditBack = () => {
    console.log("Icon pressed!");
  };

  // 清空文本框
  const handleTitleDelete = () => {
    setTitle("");
  };

  // 分中英文计算字符长度
  const calculateLength = (str) => {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      // 检查是否是中文字符，如果是，则计数+2，否则+1
      const charCode = str.charCodeAt(i);
      if (charCode >= 0x4e00 && charCode <= 0x9fff) {
        length += 1; // 中文字符
      } else {
        length += 0.5; // 英文字符
      }
    }
    return length;
  };

  // 处理标题输入框的变化,限制标题的文本长度
  const handleChangeTitle = (title) => {
    const length = calculateLength(title);
    if (length <= maxTitleLength) {
      setTitle(title);
    } else {
      Toast.show(`标题长度不能超过${maxTitleLength}个字符`);
    }
  };

  // 添加图片点击事件
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  // 处理添加标签的逻辑
  const handleAddLabel = () => {};

  const handleModalShow = () => {
    setIsModalVisible(true);
  };

  // 悬浮框关闭
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // 人均消费选择框
  const handleRangePress = (range) => {
    setSelectedRange((prevRange) => (prevRange === range ? null : range));
  };

  // 点击星星事件
  const handleClickStar = (index) => {
    setRating(index + 1); // 评级分数1~5
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* 顶部放导航栏的地方 */}
        <View style={styles.topBottom}>
          <TouchableOpacity onPress={handleEditBack}>
            <MaterialIcons name="chevron-left" size={36} color="#989797" />
          </TouchableOpacity>
        </View>
        <View style={styles.one}>
          <View style={styles.imageContainer}>
            {/* <TouchableOpacity onPress={handleImageClick}> */}
            <Image source={require("./1.jpg")} style={styles.image} />
            {/* </TouchableOpacity> */}
          </View>
          {/* <View> */}
          {/* {images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleImageClick(image)}>
              <Image
                style={{ width: 100, height: 100 }}
                source={{ uri: image }}
              />
            </TouchableOpacity>
          ))} */}
          {/* <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: selectedImage }}
                />
              </TouchableOpacity>
            </View>
          </Modal> */}
          {/* 点击图片可以方法查看的模态框 */}
          <View style={styles.imageContainer}>
            <Button
              title="+"
              disabled
              buttonStyle={{ width: 80, height: 80 }}
              titleStyle={{ fontSize: 24 }}
            />
          </View>
        </View>
        <View style={styles.two}>
          <TextInput
            value={title}
            onChangeText={handleChangeTitle}
            style={styles.titleInput}
            multiline={false} // 不允许多行输入
            placeholder="填写标题会被更多人看到哦~"
            keyboardShouldPersistTaps="handled"
          />
          {title.length > 0 && (
            <TouchableOpacity onPress={handleTitleDelete}>
              <MaterialIcons name="cancel" size={24} color="#989797" />
            </TouchableOpacity>
          )}
          <Text style={styles.maxTitle}>
            {Math.round(maxTitleLength - calculateLength(title))}
          </Text>
        </View>
        <View style={styles.line}></View>
        <View style={styles.three}>
          <TextInput
            style={styles.contentInput}
            multiline={true} // 允许多行输入
            numberOfLines={4}
            textAlignVertical="top" // 设置文本垂直对齐方式为顶部
            placeholder="添加正文"
          />
          <View style={styles.bottomContent}>
            <TouchableOpacity style={styles.addLabel} onPress={handleAddLabel}>
              <Text style={styles.addLabelText}># 主题</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalShow}>
              <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line}></View>
        <View style={styles.four}>
          <View style={styles.picker}>
            <Text style={styles.pickerText}>出行月份:</Text>
            <View style={styles.monthPicker}>
              <MonthPicker />
            </View>
          </View>
          <View style={styles.picker}>
            <Text style={styles.pickerText}>人均消费:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.rangeContainer}>
                <RangeButtonGroup
                  ranges={ranges}
                  selectedRange={selectedRange}
                  onPress={handleRangePress}
                />
              </View>
            </ScrollView>
          </View>
          <View style={styles.picker}>
            <Text style={styles.pickerText}>满意度:</Text>
            <View style={styles.rateContainer}>
              <StarRating
                rating={rating}
                starSize={30}
                totalStars={5}
                onPress={handleClickStar}
              />
            </View>
          </View>
        </View>
        <View style={styles.line}></View>
        <View style={styles.five}>
          <TouchableOpacity style={styles.five}>
            <View style={styles.left}>
              <Image
                source={require("../LogPublicPage/public/place.png")}
                style={styles.placeIcon}
              />
              <Text style={styles.placeText}>添加地点</Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#B7B7B7"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.six}>
          <TouchableOpacity>
            <View style={styles.draftBack}>
              <Image
                source={require("../LogPublicPage/public/draft.png")}
                style={styles.draftIcon}
              />
            </View>
            <Text style={styles.draftText}>存草稿</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publicArea}>
            <Text style={styles.publicText}>发布笔记</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.contentInput}
              multiline={true} // 允许多行输入
              numberOfLines={4}
              textAlignVertical="top" // 设置文本垂直对齐方式为顶部
              placeholder="添加正文"
            />
            <View style={styles.bottomContent}>
              <TouchableOpacity
                style={styles.addLabel}
                onPress={handleAddLabel}
              >
                <Text style={styles.addLabelText}># 话题</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleModalClose}>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    marginTop: 40,
    justifyContent: "center",
  },
  one: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    // borderWidth: 1,
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
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
  },
  maxTitle: {
    color: "#D1CFCF",
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: "#D1CFCF",
    marginVertical: 10,
  },
  three: {
    flex: 3,
    marginTop: 5,
  },
  contentInput: {
    flex: 1,
    fontSize: 18,
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addLabel: {
    borderRadius: 20,
    padding: 10,
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3E6E8",
  },
  addLabelText: {
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  four: {
    flex: 3,
  },
  picker: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "black",
  },
  monthPicker: {
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rangeButton: {
    width: 80,
    height: 35,
    backgroundColor: "#E3E6E8",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
  },
  selectedRangeButton: {
    borderColor: "#52BE80",
    backgroundColor: "#DEE4DC",
    borderWidth: 2,
  },
  rateContainer: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  five: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeIcon: {
    width: 25,
    height: 25,
  },
  placeText: {
    fontSize: 16,
    marginLeft: 10,
  },
  six: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  draftBox: {},
  draftBack: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#E3E6E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 3,
  },
  draftIcon: {
    width: 25,
    height: 25,
  },
  draftText: {
    fontSize: 14,
    color: "#717070",
  },
  publicArea: {
    width: 200,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E86C1",
  },
  publicText: {
    color: "white",
    fontSize: 18,
  },
});

export default LogPublicPage;
