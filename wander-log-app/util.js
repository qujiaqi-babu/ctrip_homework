// 在应用中引入配置文件
const config = require("./config.json");
import axios from "axios";
const api = axios.create({
  baseURL: config.baseURL,
});
export { api };
