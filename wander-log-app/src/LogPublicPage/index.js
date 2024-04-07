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
  Alert,
} from "react-native";
import { Button } from "@rneui/themed";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import MonthPicker from "./component/monthPicker";
import RangeButtonGroup from "./component/rangeButtonGroup";
import StarRating from "./component/starRating";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { api } from "../../util";
const config = require("../../config.json");

const Toast = Overlay.Toast;

const LogPublicPage = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const maxTitleLength = 20;

  const [content, setContent] = useState(""); // 正文状态

  const [modalVisible, setModalVisible] = useState(false); // 上传照片模态框
  const [imageUrl, setImageUrl] = useState([]);
  const [imageData, setImageData] = useState([]);

  const [imageVisible, setImageVisible] = useState(false); // 图片预览模态框
  const [selectedImage, setSelectedImage] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false); // 正文模态框
  const [labelModal, setLabelModal] = useState(false); // 标签模态框
  const [labelText, setLabelText] = useState("主题"); // 主题标签
  const labelThemes = config.topic;

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const ranges = ["0—500", "500—1000", "1000—2000", "2000以上"];
  const [rating, setRating] = useState(0);

  const formaDate = new FormData();

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

  // 第一次使用图片上传功能时会先授权
  const verifyPermission = async () => {
    const result = await ImagePicker.getCameraPermissionsAsync();
    // console.log(result);
    if (!result.granted) {
      Toast.show("需要相机权限才能使用相机");
      const askPermission = await ImagePicker.requestCameraPermissionsAsync();
      // console.log(askPermission);
      if (!askPermission.granted) {
        Alert.alert(
          "Insufficient Permissions",
          "You need to grant camera permissions to be able to upload your images",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };

  // 点击上传图像的按钮打开模态框
  const handleOpenModal = () => {
    if (imageUrl.length >= 6) {
      Toast.show("最多只能上传6张图片哦~");
      return;
    }
    setModalVisible(true);
  };

  // 相册图片上传
  const handleUploadImage = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    // 返回一个promise对象
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // 允许选择所有类型的媒体
      allowsEditing: true,
      quality: 0.5,
    });
    const url = image.assets[0].uri;
    const suffix = url.substring(url.lastIndexOf(".") + 1);
    try {
      // 读取图片的内容
      const data = await FileSystem.readAsStringAsync(url, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // 传给后端图片数据和后缀名
      // console.log(data.length);
      setImageData([...imageData, [data, suffix]]);
    } catch (error) {
      console.log("Error reading image file:", error);
    }

    setImageUrl([...imageUrl, url]);
    setModalVisible(false); // 拍照上传后关闭模态框
  };

  // 拍照上传
  const handleTakeImage = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    // 返回一个promise对象
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });
    const url = image.assets[0].uri;
    const suffix = url.substring(url.lastIndexOf(".") + 1);
    try {
      // 读取图片的内容
      const data = await FileSystem.readAsStringAsync(url, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImageData([...imageData, [data, suffix]]);
    } catch (error) {
      console.log("Error reading image file:", error);
    }

    setImageUrl([...imageUrl, url]);
    // 获取imageData
    setModalVisible(false); // 拍照上传后关闭模态框
  };

  // 添加图片点击事件
  const handleImagePress = (image) => {
    setSelectedImage(image);
    setImageVisible(true);
  };

  // 长按删除图片
  const handleDeleteImage = (index) => {
    Alert.alert(
      "删除图片",
      "确定要删除这张图片吗？",
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "删除",
          onPress: () => {
            const newImageUrl = [...imageUrl];
            newImageUrl.splice(index, 1);
            setImageUrl(newImageUrl);
            const newImageData = [...imageData];
            newImageData.splice(index, 1);
            setImageData(newImageData);
          },
        },
      ],
      { cancelable: false }
    );
  };

  // 获取文本框中的值
  const handleInputContent = (text) => {
    setContent(text);
  };

  // 处理添加标签的逻辑
  const handleAddLabel = () => {
    setLabelModal(true);
  };

  // 选择标签
  const handleLabelPress = (label) => {
    setLabelText(label);
    setLabelModal(false);
  };

  // 月份选择框
  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
  };

  // 人均消费选择框
  const handleRangePress = (range) => {
    setSelectedRange((prevRange) => (prevRange === range ? null : range));
  };

  // 点击星星事件
  const handleClickStar = (index) => {
    setRating(index + 1); // 评级分数1~5
  };

  // 提交页面数据
  const handleSubmitData = async () => {
    if (imageUrl.length === 0 || !title || !content) {
      Toast.show("请至少上传一张图片，填写标题和内容~", { duration: 2000 });
      return;
    }

    formaDate.append("images", imageData);
    console.log(formaDate);

    await api
      .post(
        "/logPublic/upload", // 虚拟机不能使用localhost
        {
          images: formaDate,
          title: title,
          content: content,
          topic: labelText,
          travelMonth: selectedMonth,
          percost: selectedRange,
          rate: rating,
          destination: null,
        }
      )
      .then((res) => {
        console.log("提交成功:", res.data.message);
        // 提交成功后跳转到我的游记页面，并刷新
        navigation.navigate("MyLog");
      })
      .catch((err) => {
        console.log("提交失败:", err);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* 解决安卓平台患处键盘，页面上挤的问题 */}
      <View style={styles.container}>
        {/* 顶部放导航栏的地方 */}
        <View style={styles.topBottom}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="chevron-left" size={36} color="#989797" />
          </TouchableOpacity>
        </View>
        {/* 第一块布局放图片和添加按钮 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.one}>
            <View style={{ flexDirection: "row" }}>
              {imageUrl.map((url, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => handleImagePress(url)}
                  onLongPress={() => {
                    handleDeleteImage(index);
                  }}
                >
                  <Image
                    key={index}
                    style={styles.imageContainer}
                    source={{ uri: url }}
                  />
                </TouchableWithoutFeedback>
              ))}
              <Modal
                visible={imageVisible}
                onRequestClose={() => setImageVisible(false)}
              >
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => setImageVisible(false)}
                >
                  <View style={{ flex: 1, backgroundColor: "black" }}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
            <View style={styles.imageContainer}>
              <Button
                title="+"
                // disabled
                buttonStyle={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#E3E6E8",
                }}
                titleStyle={{ fontSize: 24, color: "gray" }}
                onPress={handleOpenModal}
              />
            </View>
          </View>
        </ScrollView>
        {/* 图片上传方式选择模态框 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  height: "20%",
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 20,
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  onPress={handleTakeImage}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>拍照</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: 2,
                    width: "100%",
                    backgroundColor: "#D1CFCF",
                    marginVertical: 10,
                  }}
                ></View>
                <TouchableOpacity
                  onPress={handleUploadImage}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>从相册上传</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* 标题栏 */}
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
            <TouchableOpacity
              onPress={() => {
                setTitle("");
              }}
            >
              <MaterialIcons name="cancel" size={24} color="#989797" />
            </TouchableOpacity>
          )}
          <Text style={styles.maxTitle}>
            {Math.round(maxTitleLength - calculateLength(title))}
          </Text>
        </View>
        <View style={styles.line}></View>
        {/* 正文栏 */}
        <View style={styles.three}>
          <TextInput
            style={styles.contentInput}
            multiline={true} // 允许多行输入
            numberOfLines={4}
            textAlignVertical="top" // 设置文本垂直对齐方式为顶部
            placeholder="添加正文"
            onChangeText={handleInputContent}
            value={content}
          />
          <View style={styles.bottomContent}>
            <TouchableOpacity style={styles.addLabel} onPress={handleAddLabel}>
              <Text style={styles.addLabelText}># {labelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
              }}
            >
              <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* 标签模态框 */}
        <Modal
          visible={labelModal}
          animationType="slide"
          onRequestClose={() => {
            setLabelModal(false);
          }}
        >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setLabelModal(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  height: "70%",
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 20,
                  marginTop: 20,
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    添加标签
                  </Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  {labelThemes.map((labelTheme, index) => (
                    <View key={index} style={{ justifyContent: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          handleLabelPress(labelTheme);
                        }}
                      >
                        <Text style={{ fontSize: 18, marginTop: 10 }}>
                          # {labelTheme}
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.line}></View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* 正文模态框 */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.contentInput}
                multiline={true} // 允许多行输入
                numberOfLines={4}
                textAlignVertical="top" // 设置文本垂直对齐方式为顶部
                placeholder="添加正文"
                onChangeText={handleInputContent}
                value={content}
              />
              <View style={styles.bottomContent}>
                <TouchableOpacity
                  style={styles.addLabel}
                  onPress={handleAddLabel}
                >
                  <Text style={styles.addLabelText}># {labelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
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
        <View style={styles.line}></View>
        {/* 选择框 */}
        <View style={styles.four}>
          <View style={styles.picker}>
            <Text style={styles.pickerText}>出行月份:</Text>
            <View style={styles.monthPicker}>
              <MonthPicker onSelectMonth={handleSelectMonth} />
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
        {/* 添加地点 */}
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
        {/* 底部操作栏 */}
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
          {/* 提交按钮，将数据上传 */}
          <TouchableOpacity
            style={styles.publicArea}
            onPress={() => {
              handleSubmitData();
            }}
          >
            <Text style={styles.publicText}>发布笔记</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 5,
    marginRight: 5,
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
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  addLabel: {
    borderRadius: 20,
    padding: 10,
    // width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3E6E8",
  },
  addLabelText: {
    textAlign: "center",
    marginLeft: 5,
    marginRight: 5,
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
    marginBottom: 10,
  },
  publicText: {
    color: "white",
    fontSize: 18,
  },
});

export default LogPublicPage;
