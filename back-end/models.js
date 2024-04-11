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
    default: "e9b95a7e21de57284deef0dd3f818b07.jpeg",
  }, // 用户头像的 URL
  follow: {
    type: Number,
    default: 0,
  },
  fans: {
    type: Number,
    default: 0,
  },
});
UserSchema.plugin(AutoIncrement, { inc_field: "customId" });
// 游记模型
const TravelLogSchema = new Schema({
  title: { type: String }, // 标题
  content: { type: String }, // 内容
  imagesUrl: [{ type: String }], // 存储图片的 URL 列表
  travelMonth: {
    type: String,
    enum: [
      "",
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
    enum: ["", "0—500", "500—1000", "1000—2000", "2000以上"],
  }, // 人均消费
  rate: { type: Number, enum: [1, 2, 3, 4, 5] }, // 评分
  destination: { type: String }, // 目的地
  topic: { type: String }, // 主题
  likes: { type: Number, default: 0 }, // 点赞量
  collects: { type: Number, default: 0 }, // 收藏量
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
  userAvatar: { type: String, default: "1.jpg" }, // 管理员头像 URL
  role: {
    type: String,
    enum: ["superAdmin", "admin", "audit"],
    default: "audit",
  }, // 管理员/审核员角色
});

// 点赞模型
const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // 点赞者 ID
  travelLogId: { type: Schema.Types.ObjectId, ref: "TravelLog" }, // 被点赞游记 ID
});

// 收藏模型
const CollectSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // 收藏者 ID
  travelLogId: { type: Schema.Types.ObjectId, ref: "TravelLog" }, // 被收藏游记 ID
});

// 关注模型
const FocusSchema = new Schema({
  followerId: { type: Schema.Types.ObjectId, ref: "User" }, // 粉丝 ID
  beFollowedId: { type: Schema.Types.ObjectId, ref: "User" }, // 被关注者 ID
});

// 评论模型
const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // 评论者 ID
  travelLogId: { type: Schema.Types.ObjectId, ref: "TravelLog" }, // 被评论游记 ID
  comment: { type: String }, // 发布的评论
});

// 分享模型
const ShareSchema = new Schema({
  fromUserId: { type: Schema.Types.ObjectId, ref: "User" }, // 分享者 ID
  travelLogId: { type: Schema.Types.ObjectId, ref: "TravelLog" }, // 被分享游记 ID
  toUserId: { type: Schema.Types.ObjectId, ref: "User" }, // 被分享者 ID
  sharedTime: { type: Date, default: Date.now }, // 分享时间
  isWatched: { type: Boolean, default: false }, // 被分享者已查看
});

const User = mongoose.model("User", UserSchema);
const TravelLog = mongoose.model("TravelLog", TravelLogSchema);
const Manager = mongoose.model("Manager", ManagerSchema);
const Like = mongoose.model("Like", LikeSchema);
const Collect = mongoose.model("Collect", CollectSchema);
const Focus = mongoose.model("Focus", FocusSchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Share = mongoose.model("Share", ShareSchema);

module.exports = {
  User,
  TravelLog,
  Manager,
  Like,
  Collect,
  Focus,
  Comment,
  Share,
};
