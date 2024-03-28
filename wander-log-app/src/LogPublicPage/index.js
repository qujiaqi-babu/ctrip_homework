import "rn-overlay";
import { Overlay } from "react-native";
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
import ModalPicker from "react-native-picker-select";

const Toast = Overlay.Toast;

const LogPublicPage = () => {
  const [title, setTitle] = useState("");
  const maxTitleLength = 20;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const months = [
    { key: "1", value: "一月" },
    { key: "2", value: "二月" },
    { key: "3", value: "三月" },
    { key: "4", value: "四月" },
    { key: "5", value: "五月" },
    { key: "6", value: "六月" },
    { key: "7", value: "七月" },
    { key: "8", value: "八月" },
    { key: "9", value: "九月" },
    { key: "10", value: "十月" },
    { key: "11", value: "十一月" },
    { key: "12", value: "十二月" },
  ];

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

  // 处理添加标签的逻辑
  const handleAddLabel = () => {};

  const handleModalShow = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
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
            <Image source={require("./1.jpg")} style={styles.image} />
          </View>
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
              <Text style={styles.addLabelText}># 话题</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalShow}>
              <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line}></View>
        <View style={styles.four}>
          {/* <ModalPicker>
            模态选择器的内容
            data={months}
            accessible={true}
            keyExtractor={(item) => item.key.toString()}
            renderItem=
            {({ item }) => (
              <TouchableOpacity onPress={() => setSelectedMonth(item.value)}>
                <Text style={styles.monthItem}>{item.value}</Text>
              </TouchableOpacity>
            )}
          </ModalPicker> */}
          {/* 有问题 */}
        </View>
        <View style={styles.five}></View>
        <View style={styles.six}></View>
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
    flex: 4,
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
    marginTop: 10,
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
