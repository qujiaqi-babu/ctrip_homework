// 在应用中引入配置文件
import axios from "axios";
const config = require("./config.json");
const api = axios.create({
  baseURL: config.baseURL,
});
export { api };
