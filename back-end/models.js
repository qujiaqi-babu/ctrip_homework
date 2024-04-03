const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 连接 MongoDB 数据库
mongoose
  .connect("mongodb://localhost:27017/AuditManagementSystem")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// 用户模型
const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  useravatar: {
    type: String,
    default:
      "https://bpic.588ku.com/element_pic/20/07/01/3b2e533368dd628150d33b29be947d2f.jpg!/fw/224/quality/90/unsharp/true/compress/true",
  }, // 用户头像的 URL
});

// 游记模型
const TravelLogSchema = new Schema({
  title: { type: String, required: true }, // 标题
  content: { type: String, required: true }, // 内容
  imagesurl: [{ type: String }], // 存储图片的 URL 列表
  travelmonth: {
    type: String,
    enum: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  }, // 旅行月份
  percost: { type: String, enum: ["0-500", "500-1000", "1000-2000"] }, // 人均消费
  rate: { type: Number, enum: [1, 2, 3, 4, 5] }, // 评分
  destination: { type: String }, // 目的地
  topic: { type: String }, // 主题
  hits: { type: Number, default: 0 }, // 点赞量
  favorites: { type: Number, default: 0 }, // 收藏量
  userid: { type: Schema.Types.ObjectId, ref: "User" }, // 用户 ID
  lastedit: { type: Date, default: Date.now }, // 最后编辑时间
});

// 游记状态模型
const TravelLogStateSchema = new Schema({
  travellogid: { type: Schema.Types.ObjectId, ref: "TravelLog" }, // 游记 ID
  state: {
    // 游记状态
    type: String,
    enum: ["待审核", "已通过", "未通过"],
    default: "待审核",
  },
  instruction: { type: String, default: "" }, // 未通过理由
  updatetime: { type: Date, default: Date.now }, // 状态更新时间
  isdelete: { type: Boolean, default: false }, // 审核员删除游记时，isdelete置为true，用户系统不可见该游记
});

// 管理员模型
const ManagerSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  useravatar: { type: String }, // 管理员头像 URL
  role: { type: String, enum: ["admin", "audit"], default: "audit" }, // 管理员/审核员角色
});

const User = mongoose.model("User", UserSchema);
const TravelLog = mongoose.model("TravelLog", TravelLogSchema);
const TravelLogState = mongoose.model("TravelLogState", TravelLogStateSchema);
const Manager = mongoose.model("Manager", ManagerSchema);

module.exports = { User, TravelLog, TravelLogState, Manager };
