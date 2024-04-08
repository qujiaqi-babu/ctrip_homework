const express = require("express");
const config = require("../config.json");
const { User, TravelLog, Manager } = require("../models");
const router = express.Router();

//验证用户登录状态
const { authenticateToken } = require("./auth");

router.get("/getMyLogs", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // const { selectedTopic, searchContent } = req.query;
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
          { userId: userId }, // 查询状态为“已通过”的游记信息
          //   { state: "待审核" }, // 之后改回
        ],
      },
      selectedFields
    ).populate("userId", "username userAvatar"); //获取游记文档时返回关联作者的昵称和头像
    const filteredTravelLogs = travelLogs
      //   .filter((item) => {
      //     const titleMatch = item.title.includes(searchContent);
      //     const authorMatch = item.userId.username.includes(searchContent);
      //     return titleMatch || authorMatch;
      //   })
      .sort((a, b) => b.hits - a.hits) // 按点击量降序排序
      .map((item) => {
        let imageUrl = item.imagesUrl[0]; // 只展示第一张图片
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${config.baseURL}/${config.logUploadPath}/${imageUrl}`;
        }

        let userAvatar = item.userId.userAvatar;
        if (!userAvatar.startsWith("http")) {
          userAvatar = `${config.baseURL}/${config.userAvatarPath}/${userAvatar}`;
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

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: filteredTravelLogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "出错了，请联系管理员" }); // 如果出现错误，返回500错误
  }
});

//根据用户id获得他已经通过审核的游记
router.get("/getLogsByUserId/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    // const { selectedTopic, searchContent } = req.query;
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
          { userId: userId }, // 查询状态为“已通过”的游记信息
          { state: "已通过" }, // 之后改回
        ],
      },
      selectedFields
    ).populate("userId", "username userAvatar"); //获取游记文档时返回关联作者的昵称和头像
    const filteredTravelLogs = travelLogs
      //   .filter((item) => {
      //     const titleMatch = item.title.includes(searchContent);
      //     const authorMatch = item.userId.username.includes(searchContent);
      //     return titleMatch || authorMatch;
      //   })
      .sort((a, b) => b.hits - a.hits) // 按点击量降序排序
      .map((item) => {
        let imageUrl = item.imagesUrl[0]; // 只展示第一张图片
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${config.baseURL}/${config.logUploadPath}/${imageUrl}`;
        }

        let userAvatar = item.userId.userAvatar;
        if (!userAvatar.startsWith("http")) {
          userAvatar = `${config.baseURL}/${config.userAvatarPath}/${userAvatar}`;
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

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: filteredTravelLogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "出错了，请联系管理员" }); // 如果出现错误，返回500错误
  }
});

module.exports = router;
