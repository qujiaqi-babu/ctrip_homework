import AsyncStorage from "@react-native-async-storage/async-storage"; //异步存储
// 在应用中引入配置文件
const config = require("./config.json");
import axios from "axios";
const api = axios.create({
  baseURL: config.baseURL,
});

/**
 * 本地异步存储数据
 * key:String
 * value:String
 */
const storeDataToAS = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    console.log(e, "本地异步存储失败：", key);
  }
  console.log("本地异步存储成功：", key);
};
/**
 * 本地异步存储移除数据
 * key:String
 */
const removeValueFromAS = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
    console.log("本地异步存储值移除失败：", key);
  }

  console.log("成功移除本地异步存储值：", key);
};
/**
 * 本地异步存储获取数据
 * key:String
 */
const getItemFromAS = async (key) => {
  try {
    let jsonValue = await AsyncStorage.getItem(key);
    // jsonValue = JSON.parse(jsonValue);
    return jsonValue;
  } catch (e) {
    console.log("本地异步存储值获取失败：", key);
  }
};
export { api, storeDataToAS, removeValueFromAS, getItemFromAS };
