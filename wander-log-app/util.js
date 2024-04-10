import AsyncStorage from "@react-native-async-storage/async-storage"; //异步存储
// 在应用中引入配置文件
const config = require("./config.json");
import axios from "axios";
const api = axios.create({
  baseURL: config.baseURL,
});
/**
 * 拦截器：当发送请求时需要向请求头当中加入token
 */
const setAuthHeader = async () => {
  await api.interceptors.request.use(
    async (config) => {
      config.interceptors = "AddAuthorizationToken";
      const token = await getItemFromAS("token");
      // console.log(token);
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
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
export { api, storeDataToAS, removeValueFromAS, getItemFromAS, setAuthHeader };
