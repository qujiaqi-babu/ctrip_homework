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
    // console.log(selectedTopic);
    const selectedFields = {
      _id: 1,
      title: 1,
      imagesUrl: { $slice: 1 }, // 只获取第一张图片
      hits: 1,
      userId: 1,
    }; // 选择要获取的字段，1表示包含该字段，0表示不包含该字段
    const travelLogs = await TravelLog.find(
      {
        $and: [
          { state: "已通过" }, // 查询状态为“已通过”的游记信息
          //   { state: "待审核" }, // 之后改回
          { topic: { $regex: selectedTopic, $options: "i" } },
        ],
      },
      selectedFields
    ).populate("userId", "username userAvatar"); //获取游记文档时返回关联作者的昵称和头像
    const filteredTravelLogs = travelLogs
      .filter((item) => {
        const titleMatch = item.title.includes(searchContent);
        const authorMatch = item.userId.username.includes(searchContent);
        return titleMatch || authorMatch;
      })
      .sort((a, b) => b.hits - a.hits) // 按点击量降序排序
      .map((item) => {
        let imageUrl = item.imagesUrl[0]; // 只展示第一张图片
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${config.baseURL}/image/${imageUrl}`;
        }

        let userAvatar = item.userId.userAvatar;
        if (!userAvatar.startsWith("http")) {
          userAvatar = `${config.baseURL}/userAvatar/${userAvatar}`;
        }
        // 将 MongoDB 文档对象转换为普通 JavaScript 对象
        const newItem = {
          _id: item._id,
          title: item.title,
          imageUrl: imageUrl,
          hits: item.hits,
          userId: item.userId._id,
          username: item.userId.username,
          userAvatar: userAvatar,
        };
        return newItem;
      });
    // console.log("==================");
    // console.log(travelLogs);
    // console.log("==================");
    // console.log(filteredTravelLogs);
    res.json(filteredTravelLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("游记列表获取失败")); // 如果出现错误，返回500错误
  }
});

module.exports = router;
