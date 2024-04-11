const express = require("express");
const { convertDateToString } = require("../utils/timeManager");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  User,
  TravelLog,
  Manager,
  Like,
  Collect,
  Focus,
  Share,
} = require("../models");
const config = require("../config.json");
const { authenticateToken } = require("./auth");
const router = express.Router();

const createSuccessResponse = (message) => {
  return {
    success: true,
    message,
  };
};

const createErrorResponse = (message) => {
  return {
    success: false,
    message,
  };
};

// 获取瀑布流增量数据-首页
router.get("/travelLogs", async (req, res) => {
  try {
    const { selectedTopic, searchContent } = req.query;
    // 瀑布流数据加载 每次加载count张
    const count = parseInt(req.query.count);
    const travelLogs = await TravelLog.aggregate([
      {
        $lookup: {
          from: "users", // 用户集合名称
          localField: "userId", // TravelLog集合中的关联字段
          foreignField: "_id", // User集合中的关联字段
          as: "user", // 存储联结后的用户信息
        },
      },
      {
        $match: {
          $and: [
            { state: "已通过" }, // 查询状态为“已通过”的游记信息
            { isDelete: false }, // 游记信息未被逻辑删除
            { topic: { $regex: selectedTopic, $options: "i" } },
            {
              $or: [
                { title: { $regex: searchContent, $options: "i" } },
                { "user.username": { $regex: searchContent, $options: "i" } },
              ],
            },
          ],
        },
      },
      {
        // 从文档中选择并返回指定的字段
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          imagesUrl: 1,
          likes: 1,
          userId: 1,
          "user.username": 1,
          "user.userAvatar": 1,
        },
      },
      { $sample: { size: count } }, // 每次查询时采样不同的随机结果
    ]);
    const result = travelLogs
      // .sort((a, b) => b.likes - a.likes) // 按点赞量降序排序
      .map((item) => {
        let imageUrl = item.imagesUrl[0]; // 只展示第一张图片
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${config.baseURL}/${config.logUploadPath}/${imageUrl}`;
        }
        let userAvatar = item.user[0].userAvatar;
        if (!userAvatar.startsWith("http")) {
          userAvatar = `${config.baseURL}/${config.userAvatarPath}/${userAvatar}`;
        }
        // 将 MongoDB 文档对象转换为普通 JavaScript 对象
        const newItem = {
          _id: item._id,
          title: item.title,
          imageUrl: imageUrl,
          likes: item.likes,
          userId: item.userId,
          username: item.user[0].username,
          userAvatar: userAvatar,
        };
        return newItem;
      });
    // console.log("==================");
    // console.log(travelLogs);
    // console.log("==================");
    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("游记列表获取失败")); // 如果出现错误，返回500错误
  }
});

// 判断当前用户是否点赞过该游记
router.get("/checkLike/:travelLogId", authenticateToken, async (req, res) => {
  const travelLogId = req.params.travelLogId;
  const userId = req.user.id;
  try {
    // 查询点赞记录
    const like = await Like.findOne({ userId, travelLogId });
    // console.log(travelLogId, userId);
    if (like) {
      // 如果存在点赞记录，则返回用户已经点赞
      // console.log("find");
      res.json({ liked: true });
    } else {
      // 如果不存在点赞记录，则返回用户未点赞
      // console.log("not find");
      res.json({ liked: false });
    }
  } catch (error) {
    console.error("Error checking like:", error);
    res.status(500).send("Internal server error");
  }
});

// 用户点赞/取消点赞特定游记
router.post("/like", authenticateToken, async (req, res) => {
  const { travelLogId } = req.body;
  const userId = req.user.id;
  try {
    // 检查是否已经点赞
    const like = await Like.findOne({ userId, travelLogId });
    if (like) {
      // 如果已经点赞，则取消点赞，即移除该条记录
      await Like.deleteOne({ _id: like._id });
      // 查找游记并更新点赞数
      const travelLog = await TravelLog.findByIdAndUpdate(
        travelLogId,
        { $inc: { likes: -1 } } // 使用 $inc 操作符将点赞数-1
      );
      if (!travelLog) {
        res.status(404).send("TravelLog not found");
      } else {
        res.json({ liked: false });
      }
    } else {
      // 如果没有点赞，则点赞
      const newLike = new Like({ userId, travelLogId });
      await newLike.save();
      // 查找游记并更新点赞数
      const travelLog = await TravelLog.findByIdAndUpdate(
        travelLogId,
        { $inc: { likes: 1 } } // 使用 $inc 操作符将点赞数+1
      );
      if (!travelLog) {
        res.status(404).send("TravelLog not found");
      } else {
        res.json({ liked: true });
      }
    }
  } catch (error) {
    console.error("Error like:", error);
    res.status(500).send("Internal server error");
  }
});

// 判断当前用户是否收藏过该游记
router.get(
  "/checkCollect/:travelLogId",
  authenticateToken,
  async (req, res) => {
    const travelLogId = req.params.travelLogId;
    const userId = req.user.id;
    try {
      // 查询收藏记录
      const collect = await Collect.findOne({ userId, travelLogId });
      // console.log(travelLogId, userId);
      if (collect) {
        // 如果存在收藏记录，则返回用户已经收藏
        // console.log("find");
        res.json({ collected: true });
      } else {
        // 如果不存在收藏记录，则返回用户未收藏
        // console.log("not find");
        res.json({ collected: false });
      }
    } catch (error) {
      console.error("Error checking collect:", error);
      res.status(500).send("Internal server error");
    }
  }
);

// 用户收藏/取消收藏特定游记
router.post("/collect", authenticateToken, async (req, res) => {
  const { travelLogId } = req.body;
  const userId = req.user.id;
  try {
    // 检查是否已经收藏
    const collect = await Collect.findOne({ userId, travelLogId });
    if (collect) {
      // 如果已经收藏，则取消收藏，即移除该条记录
      await Collect.deleteOne({ _id: collect._id });
      // 查找游记并更新收藏数
      const travelLog = await TravelLog.findByIdAndUpdate(
        travelLogId,
        { $inc: { collects: -1 } } // 使用 $inc 操作符将点赞数-1
      );
      if (!travelLog) {
        res.status(404).send("TravelLog not found");
      } else {
        res.json({ collected: false });
      }
    } else {
      // 如果没有收藏，则收藏
      const newCollect = new Collect({ userId, travelLogId });
      await newCollect.save();
      // 查找游记并更新收藏数
      const travelLog = await TravelLog.findByIdAndUpdate(
        travelLogId,
        { $inc: { collects: 1 } } // 使用 $inc 操作符将点赞数+1
      );
      if (!travelLog) {
        res.status(404).send("TravelLog not found");
      } else {
        res.json({ collected: true });
      }
    }
  } catch (error) {
    console.error("Error collect:", error);
    res.status(500).send("Internal server error");
  }
});

// 获取当前登录用户的好友列表/查找特定好友
router.get("/myFriends", authenticateToken, async (req, res) => {
  // 获取token中的用户id
  const { searchContent } = req.query;
  // console.log("searchContent:", searchContent);
  const userId = req.user.id;
  console.log(userId);
  try {
    const users = await Focus.aggregate([
      // 第一阶段：根据当前用户的 ID 查找其关注的用户 ID
      {
        $match: {
          $and: [
            { followerId: new ObjectId(userId) }, // 需要转换数据类型
            { beFollowedId: { $ne: new ObjectId(userId) } },
          ],
        },
      },
      // 第二阶段：联合查询获取关注的用户信息
      {
        $lookup: {
          from: "users", // 用户集合名称
          localField: "beFollowedId", // Focus 集合中的被关注者 ID 字段
          foreignField: "_id", // User 集合中的用户 ID 字段
          as: "user", // 存储联合后的用户信息数组
        },
      },
      // 第三阶段：根据搜索内容筛选游客号或用户名，为空则显示全部好友
      {
        $match: {
          $or: [
            { "user.username": { $regex: searchContent, $options: "i" } }, // 使用正则表达式进行模糊查询用户名，忽略大小写
            {
              "user.customId":
                searchContent === "" || isNaN(searchContent)
                  ? -1
                  : parseInt(searchContent),
            }, // 使用正则表达式进行模糊查询customId，忽略大小写
          ],
        },
      },
      // 第四阶段：筛选出需要的用户信息字段
      {
        $project: {
          "user._id": 1,
          "user.username": 1,
          "user.userAvatar": 1,
          "user.profile": 1,
        },
      },
    ]);
    // console.log(users);

    if (users) {
      const newUsers = users.map((item) => {
        // console.log(item.user[0]);
        let avatar = item.user[0].userAvatar; //用户头像
        if (avatar != null && !avatar.startsWith("http")) {
          avatar = `${config.baseURL}/${config.userAvatarPath}/${avatar}`;
        }
        // console.log(avatar);
        const newItem = {
          userId: item.user[0]._id,
          username: item.user[0].username,
          userAvatar: avatar,
          profile: item.user[0].profile,
        };
        return newItem;
      });

      console.log("success", newUsers);
      res.json(newUsers);
    } else {
      res.status(401).json({ status: "error", message: "请先登录" });
      console.log("用户不存在");
    }
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ status: "error", message: "出错了，请联系管理员" });
  }
});

// 用户向好友列表分享特定游记
router.post("/share", authenticateToken, async (req, res) => {
  const fromUserId = req.user.id;
  const { travelLogId, toUserIds } = req.body;
  // const
  try {
    const result = await Share.insertMany(
      toUserIds.map((toUserId) => ({
        fromUserId,
        travelLogId,
        toUserId,
      }))
    );
    // console.log(`${result.length} documents inserted.`);
    res.json(result);
  } catch (error) {
    console.error("Error collect:", error);
    res.status(500).send("Internal server error");
  }
});

// 获取瀑布流增量数据-我的消息页
router.get("/myMessages", authenticateToken, async (req, res) => {
  try {
    // 瀑布流数据加载 每次增量加载count张
    const limitCount = parseInt(req.query.limitCount);
    const skipCount = parseInt(req.query.skipCount);
    const toUserId = req.user.id;
    const shares = await Share.aggregate([
      // { $match: { isWatched: false } },
      { $match: { toUserId: new ObjectId(toUserId) } }, // 匹配发送给当前登录用户的分享
      { $sort: { sharedTime: -1 } }, // 按分享时间由近及远排序
      {
        $lookup: {
          from: "users",
          localField: "fromUserId",
          foreignField: "_id",
          as: "fromUser",
        },
      },
      {
        $lookup: {
          from: "travellogs",
          localField: "travelLogId",
          foreignField: "_id",
          as: "travelLog",
        },
      },
      {
        $project: {
          _id: 1,
          sharedTime: 1,
          "fromUser.username": 1,
          "fromUser.userAvatar": 1,
          travelLogId: 1,
          "travelLog.title": 1,
          "travelLog.imagesUrl": 1,
        },
      },
    ]);
    // 跳过已获取的skipCount条分享，限制结果数量为limitCount条
    const result = shares.slice(skipCount, skipCount + limitCount);
    const newResult = result
      // .sort((a, b) => b.likes - a.likes) // 按点赞量降序排序
      .map((item) => {
        let imageUrl = item.travelLog[0].imagesUrl[0]; // 只展示第一张图片
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${config.baseURL}/${config.logUploadPath}/${imageUrl}`;
        }
        let userAvatar = item.fromUser[0].userAvatar;
        if (!userAvatar.startsWith("http")) {
          userAvatar = `${config.baseURL}/${config.userAvatarPath}/${userAvatar}`;
        }
        // 将 MongoDB 文档对象转换为普通 JavaScript 对象
        const newItem = {
          id: item._id,
          sharedTime: convertDateToString(item.sharedTime),
          fromUsername: item.fromUser[0].username,
          fromUserAvatar: userAvatar,
          travelLogId: item.travelLogId,
          travelLogTitle: item.travelLog[0].title,
          travelLogImageUrl: imageUrl,
        };
        return newItem;
      });
    // console.log(newResult);
    res.json(newResult);
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("我的消息获取失败"));
  }
});

// 根据游记id返回作者详细信息
router.get("/findAuthor/:id", async (req, res) => {
  try {
    const logId = req.params.id;
    console.log("logId", logId);
    const travelLog = await TravelLog.findById(new ObjectId(logId));
    console.log("travelLog", travelLog);
    if (!travelLog) {
      return res.status(404).json({ error: "Travel log not found" });
    }
    const user = await User.findById(travelLog.userId);
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ error: "Travel author not found" });
    }
    let userAvatar = user.userAvatar;
    if (!userAvatar.startsWith("http")) {
      userAvatar = `${config.baseURL}/${config.userAvatarPath}/${userAvatar}`;
    }
    const userInfo = {
      userId: user._id,
      username: user.username,
      userAvatar: userAvatar,
    };
    console.log(userInfo);
    res.json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
