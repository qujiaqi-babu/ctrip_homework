const express = require("express");
// const axios = require("axios");
// const sharp = require("sharp");
const { User, TravelLog, Manager, Like, Collect } = require("../models");
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

// 获取瀑布流增量数据
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

// 获取瀑布流增量数据
// router.get("/travelLogs", authenticateTokenForHome, async (req, res) => {
//   // 如果用户已登录，则同时获取其是否点赞过该游记
//   if (req.user) {
//     console.log("已登录");
//     const userId = req.user.id;
//     try {
//       const { selectedTopic, searchContent } = req.query;
//       // 瀑布流数据加载 每次加载count张
//       const count = parseInt(req.query.count);
//       const travelLogs = await TravelLog.aggregate([
//         {
//           $lookup: {
//             from: "users", // 用户集合名称
//             localField: "userId", // TravelLog集合中的关联字段
//             foreignField: "_id", // User集合中的关联字段
//             as: "user", // 存储联结后的用户信息
//           },
//         },
//         {
//           $lookup: {
//             from: "likes", // 点赞集合名称
//             localField: "_id", // TravelLog集合中的关联字段
//             foreignField: "travelLogId", // Like集合中的关联字段
//             as: "like", // 存储联结后的点赞信息
//           },
//         },
//         {
//           $match: {
//             $and: [
//               { state: "已通过" }, // 查询状态为“已通过”的游记信息
//               { isDelete: false }, // 游记信息未被逻辑删除
//               { topic: { $regex: selectedTopic, $options: "i" } },
//               {
//                 $or: [
//                   { title: { $regex: searchContent, $options: "i" } },
//                   { "user.username": { $regex: searchContent, $options: "i" } },
//                 ],
//               },
//             ],
//           },
//         },
//         {
//           // 从文档中选择并返回指定的字段
//           $project: {
//             _id: 1,
//             title: 1,
//             content: 1,
//             imagesUrl: 1,
//             likes: 1,
//             userId: 1,
//             "user.username": 1,
//             "user.userAvatar": 1,
//             "like.userId": {
//               $ifNull: [{ $arrayElemAt: ["$like.userId", 0] }, null],
//             },
//             liked: {
//               $cond: {
//                 if: {
//                   $in: [userId, "$like.userId"],
//                 },
//                 then: true,
//                 else: false,
//               },
//             },
//           },
//         },
//         { $sample: { size: count } }, // 每次查询时采样不同的随机结果
//       ]);
//       const result = travelLogs
//         // .sort((a, b) => b.likes - a.likes) // 按点赞量降序排序
//         .map((item) => {
//           console.log(item);
//           // const likedUser = item.like.map((item)=>{})
//           let imageUrl = item.imagesUrl[0]; // 只展示第一张图片
//           if (!imageUrl.startsWith("http")) {
//             imageUrl = `${config.baseURL}/${config.logUploadPath}/${imageUrl}`;
//           }
//           let userAvatar = item.user[0].userAvatar;
//           if (!userAvatar.startsWith("http")) {
//             userAvatar = `${config.baseURL}/${config.userAvatarPath}/${userAvatar}`;
//           }
//           // 将 MongoDB 文档对象转换为普通 JavaScript 对象
//           const newItem = {
//             _id: item._id,
//             title: item.title,
//             imageUrl: imageUrl,
//             likes: item.likes,
//             userId: item.userId,
//             username: item.user[0].username,
//             userAvatar: userAvatar,
//           };
//           return newItem;
//         });
//       // console.log("==================");
//       // console.log(travelLogs);
//       // console.log("==================");
//       // console.log(result);
//       res.json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json(createErrorResponse("游记列表获取失败")); // 如果出现错误，返回500错误
//     }
//   }
// });

// router.post("/addUser", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = new User({
//       username,
//       password,
//     });
//     await user.save();
//     console.log("用户添加成功");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(createErrorResponse("用户添加失败"));
//   }
// });

// router.get("/topics", async (req, res) => {
//   try {
//     //   const { selectedTopic, searchContent } = req.body;
//     const topics = await TravelLog.aggregate([
//       { $group: { _id: "$topic" } }, // 按照主题字段进行分组
//       { $project: { _id: 0, topic: "$_id" } }, // 将结果重新映射为包含主题字段的文档
//     ]);
//     const topicList = topics.map((item) => item.topic).sort(); // 提取主题字段的值
//     console.log("topicList");
//     console.log(topicList);
//     res.json(topicList); // 将查询结果作为JSON返回
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(createErrorResponse("游记主题获取失败")); // 如果出现错误，返回500错误
//   }
// });

module.exports = router;
