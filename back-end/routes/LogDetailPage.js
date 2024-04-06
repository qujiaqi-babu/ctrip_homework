const express = require("express");
const { User, TravelLog, Manager } = require("../models");
const router = express.Router();

// 根据游记id返回游记详细信息
router.get("/findLog/:id", async (req, res) => {
  try{
    const logId = req.params.id;
    const travelLog = await TravelLog.findById(logId);
    if (!travelLog) {
      return res.status(404).json({ error: "Travel log not found"});
    }
    res.json(travelLog);
    console.log(travelLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;


