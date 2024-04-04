const express = require("express");
const { User, TravelLog, Manager } = require("../models");
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

router.get("/travelLogs", async (req, res) => {
  try {
    const { selectedTopic, searchContent } = req.body;
    const travelLogs = await TravelLog.find({ state: "已通过" }); // 查询状态为“已通过”的游记信息
    console.log(travelLogs);
    res.json(travelLogs); // 将查询结果作为JSON返回
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("游记列表获取失败")); // 如果出现错误，返回500错误
  }
});

module.exports = router;
