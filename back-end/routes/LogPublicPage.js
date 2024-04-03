const express = require("express");
const { User, TravelLog, Manager } = require("../models");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

const calaMD5 = (data) => {
  return crypto.createHash("md5").update(data).digest("hex");
};

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
router.post("/upload", async (req, res) => {
  const {
    title,
    content,
    imageData,
    travelMonth,
    percost,
    rate,
    destination,
    topic,
    userId,
  } = req.body;
  res.setHeader("content-type", "application/json");
  // 保存游记图片
  try {
    // console.log(imageData); // 打印出来是乱码但是没有关系
    const fileNameList = imageData.map((data) => {
      const md5 = calaMD5(data[0]);
      const ext = data[1];
      return `${md5}.${ext}`;
    }); // 摘要运算得到加密文件名
    console.log(fileNameList);
    fileNameList.forEach((fileName, index) =>
      saveImage(imageData[index][0], fileName)
    );

    const travelLog = new TravelLog({
      title,
      content,
      fileNameList,
      travelMonth,
      percost,
      rate,
      destination,
      topic,
      userId,
    });
    // 保存游记到数据库
    await travelLog.save();
    res.status(201).json(createSuccessResponse("游记发布成功！"));
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
