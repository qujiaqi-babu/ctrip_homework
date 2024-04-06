const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

// 连接 MongoDB 数据库
mongoose
  .connect("mongodb://127.0.0.1:27017/AuditManagementSystem")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// 用户模型
const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  customId: { type: Number },
  userAvatar: {
    type: String,
    default: "f8f769da-109a-459e-8113-2239ab1f5d96.jpg",
  }, // 用户头像的 URL
  profile: {
    type: String,
    default: "有趣的灵魂万里挑一",
  },
  gender: {
    type: String,
    enum: ["男", "女", "other"],
    default: "other",
  },
  backgroundImage: {
    type: String,
    default: "d2dc43736e4768139926d995db225f5f.jpeg",
  }, // 用户头像的 URL
});
UserSchema.plugin(AutoIncrement, { inc_field: "customId" });
// 游记模型
const TravelLogSchema = new Schema({
  title: { type: String, required: true }, // 标题
  content: { type: String, required: true }, // 内容
  imagesUrl: [{ type: String }], // 存储图片的 URL 列表
  travelMonth: {
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
  percost: {
    type: String,
    enum: ["0—500", "500—1000", "1000—2000", "2000以上"],
  }, // 人均消费
  rate: { type: Number, enum: [1, 2, 3, 4, 5] }, // 评分
  destination: { type: String }, // 目的地
  topic: { type: String }, // 主题
  hits: { type: Number, default: 0 }, // 点赞量
  favorites: { type: Number, default: 0 }, // 收藏量
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // 用户 ID
  editTime: { type: Date, default: Date.now }, // 最后编辑时间

  state: {
    // 游记状态
    type: String,
    enum: ["待审核", "已通过", "未通过", "未发布"],
    default: "待审核",
  },
  instruction: { type: String, default: "" }, // 未通过理由
  updateTime: { type: Date, default: Date.now }, // 最新状态更新时间
  isDelete: { type: Boolean, default: false }, // 审核员删除游记时，isdelete置为true，用户系统不可见该游记
});

// 管理员模型
const ManagerSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userAvatar: { type: String }, // 管理员头像 URL
  role: { type: String, enum: ["admin", "audit"], default: "audit" }, // 管理员/审核员角色
});

const User = mongoose.model("User", UserSchema);
const TravelLog = mongoose.model("TravelLog", TravelLogSchema);
const Manager = mongoose.model("Manager", ManagerSchema);

module.exports = { User, TravelLog, Manager };
