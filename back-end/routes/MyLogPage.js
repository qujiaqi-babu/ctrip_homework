const express = require("express");
const config = require("../config.json");
const { User, TravelLog, Manager, Like, Collect } = require("../models");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//验证用户登录状态
const { authenticateToken } = require("./auth");

//获取我发布的笔记
router.get("/getMyLogs", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // const { selectedTopic, searchContent } = req.query;
    // console.log(selectedTopic);
    const selectedFields = {
      _id: 1,
      title: 1,
      imagesUrl: { $slice: 1 }, // 只获取第一张图片
      likes: 1,
      state: 1,
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
          state: item.state,
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

//获取我点赞的笔记
router.get("/getMyLikeLogs", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const travelLogs = await Like.aggregate([
      {
        $lookup: {
          from: "travellogs", // travelLogs集合名称
          localField: "travelLogId", // Like集合中的关联字段
          foreignField: "_id", // travelLogs集合中的关联字段
          as: "travelLog", // 存储联结后的用户信息
        },
      },
      {
        $match: {
          $and: [
            { "travelLog.state": "已通过" }, // 查询状态为“已通过”的游记信息
            {
              userId: new ObjectId(userId),
            },
          ],
        },
      },
      {
        // 从文档中选择并返回指定的字段
        $project: {
          userId: 1,
          "travelLog._id": 1,
          "travelLog.title": 1,
          "travelLog.imagesUrl": 1,
          "travelLog.likes": 1,
          "travelLog.userId": 1,
          "travelLog.state": 1,
        },
      },
      // { $sample: { size: count } },
    ]);
    // console.log(travelLogs);
    const result = travelLogs
      .sort((a, b) => b.travelLog[0].likes - a.travelLog[0].likes) // 按点击量降序排序
      .map((t) => {
        // console.log(t);
        let item = t.travelLog[0];

        let imageUrl = item.imagesUrl[0]; // 只展示第一张图片
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${config.baseURL}/${config.logUploadPath}/${imageUrl}`;
        }
        // let userAvatar = item.user[0].userAvatar;
        // 将 MongoDB 文档对象转换为普通 JavaScript 对象
        const newItem = {
          _id: item._id,
          title: item.title,
          imageUrl: imageUrl,
          likes: item.likes,
          userId: item.userId,
          state: item.state,
          // username: item.user[0].username,
          // userAvatar: userAvatar,
        };
        return newItem;
      });
    // console.log("==================");
    // console.log(travelLogs);
    // console.log("==================");
    // console.log(result);
    res
      .status(200)
      .json({ status: "success", message: "get successful", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "获取点赞游记列表失败，请联系管理员",
    }); // 如果出现错误，返回500错误
  }
});

//获取用户收藏的笔记
router.get("/getMyCollectLogs", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const travelLogs = await Collect.aggregate([
      {
        $lookup: {
          from: "travellogs", // travelLogs集合名称
          localField: "travelLogId", // Like集合中的关联字段
          foreignField: "_id", // travelLogs集合中的关联字段
          as: "travelLog", // 存储联结后的用户信息
        },
      },
      {
        $match: {
          $and: [
            { "travelLog.state": "已通过" }, // 查询状态为“已通过”的游记信息
            {
              userId: new ObjectId(userId),
            },
          ],
        },
      },
      {
        // 从文档中选择并返回指定的字段
        $project: {
          userId: 1,
          "travelLog._id": 1,
          "travelLog.title": 1,
          "travelLog.imagesUrl": 1,
          "travelLog.likes": 1,
          "travelLog.collects": 1,
          "travelLog.userId": 1,
          "travelLog.state": 1,
        },
      },
      // { $sample: { size: count } },
    ]);
    // console.log(travelLogs);
    const result = travelLogs
      .sort((a, b) => b.travelLog[0].likes - a.travelLog[0].likes) // 按点击量降序排序
      .map((t) => {
        // console.log(t);
        let item = t.travelLog[0];

        let imageUrl = item.imagesUrl[0]; // 只展示第一张图片
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${config.baseURL}/${config.logUploadPath}/${imageUrl}`;
        }
        // let userAvatar = item.user[0].userAvatar;
        // 将 MongoDB 文档对象转换为普通 JavaScript 对象
        const newItem = {
          _id: item._id,
          title: item.title,
          imageUrl: imageUrl,
          likes: item.likes,
          collects: item.collects,
          userId: item.userId,
          state: item.state,
          // username: item.user[0].username,
          // userAvatar: userAvatar,
        };
        return newItem;
      });
    // console.log("==================");
    // console.log(travelLogs);
    // console.log("==================");
    // console.log(result);
    res
      .status(200)
      .json({ status: "success", message: "get successful", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "获取点赞游记列表失败，请联系管理员",
    }); // 如果出现错误，返回500错误
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
      state: 1,
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
          state: item.state,
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

// 删除游记
router.delete("/deleteLogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const log = await TravelLog.findByIdAndDelete(id);
    if (!log) {
      return res.status(404).json({ message: "游记不存在" });
    }
    await Manager.deleteOne({ log });
    res.json({ message: "游记删除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
