const express = require("express");
const { User, TravelLog, Manager } = require("../models");
const config = require("../config.json");
const router = express.Router();

// 根据游记id返回游记详细信息
router.get("/findLog/:id", async (req, res) => {
  try {
    const logId = req.params.id;
    const travelLog = await TravelLog.findById(logId);
    if (!travelLog) {
      return res.status(404).json({ error: "Travel log not found" });
    }
    const newImagesUrl = travelLog.imagesUrl.map(
      (imageUrl) => `${config.baseURL}/${config.logUploadPath}/${imageUrl}`
    );
    travelLog.imagesUrl = newImagesUrl;
    res.json(travelLog);
    // console.log(travelLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/findLog/:id", async (req, res) => {
//   try {
//     const logId = req.params.id;
//     const travelLog = await TravelLog.findById(logId).populate("userId");
//     if (!travelLog) {
//       return res.status(404).json({ error: "Travel log not found" });
//     }
//     const newImagesUrl = travelLog.imagesUrl.map(
//       (imageUrl) => `${config.baseURL}/${config.logUploadPath}/${imageUrl}`
//     );
//     const newAvatarUrl =
//     `${config.baseURL}/${config.userAvatarPath}/${travelLog.userId.userAvatar}`;
//     travelLog.userId.userAvatar = newAvatarUrl;
//     travelLog.imagesUrl = newImagesUrl;
//     res.json(travelLog);
//     console.log(travelLog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
