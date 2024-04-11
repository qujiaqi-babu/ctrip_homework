const express = require("express");
const { User, TravelLog, Manager } = require("../models");
const router = express.Router();
const config = require("../config.json");
const { saveImage } = require("../utils/fileManager");
const crypto = require("crypto");
const { authenticateToken } = require("./auth");
const calaMD5 = (data) => {
  return crypto.createHash("md5").update(data).digest("hex");
};

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

// 游记发布提交
router.post("/upload", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  // console.log(userId);
  const contentLength = req.headers["content-length"];
  console.log("请求体大小:", contentLength, "字节");
  const {
    travelId,
    title,
    content,
    state,
    httpUrls,
    images,
    travelMonth,
    percost,
    rate,
    destination,
    topic,
  } = req.body;
  const imageData = images._parts[0][1];
  res.setHeader("content-type", "application/json");
  // 保存游记图片
  try {
    // console.log(imageData); // 打印出来是乱码但是没有关系
    const imagesUrl = imageData.map((data) => {
      const md5 = calaMD5(data[0]);
      const ext = data[1];
      return `${md5}.${ext}`;
    }); // 摘要运算得到加密文件名
    console.log(imagesUrl);
    imagesUrl.forEach((fileName, index) =>
      saveImage(imageData[index][0], config.logUploadPath, fileName)
    );

    const newImagesUrl = [...httpUrls, ...imagesUrl];
    console.log(newImagesUrl);
    const travelLog = new TravelLog({
      title,
      content,
      imagesUrl: newImagesUrl,
      travelMonth,
      percost,
      rate,
      destination,
      topic,
      userId,
      state,
    });
    // 保存游记到数据库
    if (travelId) {
      await TravelLog.findByIdAndUpdate(travelId, {
        title,
        content,
        imagesUrl: newImagesUrl,
        travelMonth,
        percost,
        rate,
        destination,
        topic,
        userId,
        state,
      });
    } else {
      await travelLog.save();
    }

    res.status(201).json(createSuccessResponse("游记发布成功！"));
  } catch (err) {
    console.error(err);
    res.status(500).json(createErrorResponse(err));
    return;
  }
});

// 游记保存到草稿箱
router.post("/drafts", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  // console.log(userId);
  const contentLength = req.headers["content-length"];
  console.log("请求体大小:", contentLength, "字节");
  const {
    title,
    content,
    images,
    travelMonth,
    percost,
    rate,
    destination,
    topic,
    state,
  } = req.body;
  console.log(req.body);
  const imageData = images._parts[0][1];
  res.setHeader("content-type", "application/json");
  // 保存游记图片
  try {
    // console.log(imageData); // 打印出来是乱码但是没有关系
    const imagesUrl = imageData.map((data) => {
      const md5 = calaMD5(data[0]);
      const ext = data[1];
      return `${md5}.${ext}`;
    }); // 摘要运算得到加密文件名
    console.log(imagesUrl);
    imagesUrl.forEach((fileName, index) =>
      saveImage(imageData[index][0], config.logUploadPath, fileName)
    );

    const travelLog = new TravelLog({
      title,
      content,
      imagesUrl,
      travelMonth,
      percost,
      rate,
      destination,
      topic,
      userId,
      state,
    });
    // 保存游记到数据库
    await travelLog.save();
    res.status(201).json(createSuccessResponse("游记保存成功！"));
  } catch (err) {
    console.error(err);
    res.status(500).json(createErrorResponse(err));
    return;
  }
});

// 获取审核通过的游记列表
// app.get("/api/travelLogList", async (req, res) => {
//   try {
//     const users = await TravelLogState.find({}, "username email role");
//     // console.log(users);
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("服务器出错啦！用户列表获取失败，请稍后重试~");
//   }
// });

// // 编辑用户
// app.put("/api/userEdit/:id", async (req, res) => {
//   try {
//     const userId = req.params.id; // 获取 URL 中的 id 参数
//     const { username, email, role } = req.body;
//     const user = await User.findOneAndUpdate(
//       { _id: userId },
//       {
//         $set: {
//           username,
//           email,
//           role,
//         },
//       }
//     );
//     if (!user) {
//       return res.status(404).send("该用户不存在");
//     } else {
//       return res.status(201).send({ message: "用户编辑成功", user: user });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("服务器出错啦！用户编辑失败，请稍后重试~");
//   }
// });

// // 删除用户
// app.delete("/api/userEdit/:id", async (req, res) => {
//   try {
//     const userId = req.params.id; // 获取 URL 中的 id 参数
//     const deletedUser = await User.findByIdAndDelete(userId);
//     if (!deletedUser) {
//       return res.status(404).send("该用户不存在");
//     } else {
//       return res
//         .status(201)
//         .send({ message: "用户删除成功", user: deletedUser });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("服务器出错啦！用户编辑失败，请稍后重试~");
//   }
// });

module.exports = router;
