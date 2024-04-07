const express = require("express");
const config = require("../config.json");

const fs = require("fs").promises;
const router = express.Router();
const path = require("path");
const { User, TravelLog, Manager } = require("../models"); //引入模型
const crypto = require("crypto");

const calaMD5 = (data) => {
  return crypto.createHash("md5").update(data).digest("hex");
};
//验证用户登录状态
const { authenticateToken } = require("./auth");

// 检查目录是否存在
const directoryExists = async (directoryPath) => {
  try {
    await fs.access(directoryPath);
    return true;
  } catch (error) {
    return false;
  }
};
// 检查文件是否存在
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

const saveImage = async (base64Image, fileName) => {
  try {
    const outputDirectory = path.resolve(__dirname, "../image");
    if (!(await directoryExists(outputDirectory))) {
      await fs.mkdir(outputDirectory);
    }
    const fileOutputPath = path.resolve(outputDirectory, fileName);
    if (await fileExists(fileOutputPath)) {
      console.log(`File ${fileOutputPath} already exists.`);
      return;
    }
    console.log(`Saving image to ${fileOutputPath}`);
    // 将 Base64 编码的字符串解码为 Buffer 对象
    const imageBuffer = Buffer.from(base64Image, "base64");
    await fs.writeFile(fileOutputPath, imageBuffer, "binary");
  } catch (error) {
    console.error("Error saving image:", error);
  }
};

router.get("/info", authenticateToken, async (req, res) => {
  // 获取token中的用户id
  const userId = req.user.id;
  console.log(userId);
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      let userAvatar = user.userAvatar; //用户头像
      if (userAvatar != null && !userAvatar.startsWith("http")) {
        userAvatar = `${config.baseURL}/image/${userAvatar}`;
      }
      let background_image = user.backgroundImage; // 背景图
      if (background_image != null && !background_image.startsWith("http")) {
        background_image = `${config.baseURL}/image/${background_image}`;
      }
      console.log("success");
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          userAvatar: userAvatar,
          username: user.username,
          customId: user.customId,
          profile: user.profile,
          gender: user.gender,
          backgroundImage: background_image, // 用户头像的 URL
        },
      });
    } else {
      res.status(401).json({ status: "error", message: "请先登录" });
      console.log("用户不存在");
    }
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ status: "error", message: "出错了，请联系管理员" });
  }
});

router.post("/updateBackgroundImage", authenticateToken, async (req, res) => {
  //todo:上传的背景图片需要管理员审核？
  // 获取token中的用户id
  const userId = req.user.id;
  //获取请求体中的图片
  const { images } = req.body;
  const imageData = images._parts[0][1];
  try {
    const md5 = calaMD5(imageData[0]);
    const ext = imageData[1];
    const imagesUrl = md5 + "." + ext;
    // 摘要运算得到加密文件名
    console.log(imagesUrl);
    saveImage(imageData[0], imagesUrl);
    //更新用户的背景图片
    console.log(userId);
    const result = await User.updateOne(
      { _id: userId },
      { $set: { backgroundImage: imagesUrl } }
    );
    console.log(result); // 打印更新操作的结果信息
    if (result.modifiedCount > 0) {
      console.log("success");
      let background_image = imagesUrl;
      if (background_image != null && !background_image.startsWith("http")) {
        background_image = `${config.baseURL}/image/${background_image}`;
      }
      res.status(200).json({
        status: "success",
        message: "update successful",
        data: {
          url: background_image, // 用户头像的 URL
        },
      });
    } else {
      res.status(401).json({ status: "error", message: "更新失败" });
      console.log("请不要上传相同的图片");
    }
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ status: "error", message: "出错了，请联系管理员" });
  }
});

router.post("/updateUserAvatar", authenticateToken, async (req, res) => {
  //todo:上传的背景图片需要管理员审核？
  // 获取token中的用户id
  const userId = req.user.id;
  //获取请求体中的图片
  const { images } = req.body;
  const imageData = images._parts[0][1];
  try {
    const md5 = calaMD5(imageData[0]);
    const ext = imageData[1];
    const imagesUrl = md5 + "." + ext;
    // 摘要运算得到加密文件名
    console.log(imagesUrl);
    saveImage(imageData[0], imagesUrl);
    //更新用户的背景图片
    console.log(userId);
    const result = await User.updateOne(
      { _id: userId },
      { $set: { userAvatar: imagesUrl } }
    );
    console.log(result); // 打印更新操作的结果信息
    if (result.modifiedCount > 0) {
      console.log("success");
      let background_image = imagesUrl;
      if (background_image != null && !background_image.startsWith("http")) {
        background_image = `${config.baseURL}/image/${background_image}`;
      }
      res.status(200).json({
        status: "success",
        message: "update successful",
        data: {
          url: background_image, // 用户头像的 URL
        },
      });
    } else {
      res.status(401).json({ status: "error", message: "更新失败" });
      console.log("请不要上传相同的图片");
    }
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ status: "error", message: "出错了，请联系管理员" });
  }
});

module.exports = router;
