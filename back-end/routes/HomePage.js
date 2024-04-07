const express = require("express");
const { User, TravelLog, Manager } = require("../models");
const config = require("../config.json");
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

router.post("/addUser", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({
      username,
      password,
    });
    await user.save();
    console.log("用户添加成功");
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("用户添加失败"));
  }
});

router.get("/topics", async (req, res) => {
  try {
    //   const { selectedTopic, searchContent } = req.body;
    const topics = await TravelLog.aggregate([
      { $group: { _id: "$topic" } }, // 按照主题字段进行分组
      { $project: { _id: 0, topic: "$_id" } }, // 将结果重新映射为包含主题字段的文档
    ]);
    const topicList = topics.map((item) => item.topic).sort(); // 提取主题字段的值
    console.log("topicList");
    console.log(topicList);
    res.json(topicList); // 将查询结果作为JSON返回
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("游记主题获取失败")); // 如果出现错误，返回500错误
  }
});

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
          hits: 1,
          userId: 1,
          "user.username": 1,
          "user.userAvatar": 1,
        },
      },
      { $sample: { size: count } },
    ]);
    const result = travelLogs
      .sort((a, b) => b.hits - a.hits) // 按点击量降序排序
      .map((item) => {
        let imageUrl = item.imagesUrl[0]; // 只展示第一张图片
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${config.baseURL}/image/${imageUrl}`;
        }
        let userAvatar = item.user[0].userAvatar;
        if (!userAvatar.startsWith("http")) {
          userAvatar = `${config.baseURL}/userAvatar/${userAvatar}`;
        }
        // 将 MongoDB 文档对象转换为普通 JavaScript 对象
        const newItem = {
          _id: item._id,
          title: item.title,
          imageUrl: imageUrl,
          hits: item.hits,
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

module.exports = router;
