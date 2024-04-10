const express = require("express");
const config = require("../config.json");
const router = express.Router();
const { User, TravelLog, Manager, Focus } = require("../models"); //引入模型
const crypto = require("crypto");
const { saveImage } = require("../utils/fileManager");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const calaMD5 = (data) => {
  return crypto.createHash("md5").update(data).digest("hex");
};
//验证用户登录状态
const { authenticateToken } = require("./auth");

router.get("/info", authenticateToken, async (req, res) => {
  // 获取token中的用户id
  const userId = req.user.id;
  console.log(userId);
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      let userAvatar = user.userAvatar; //用户头像
      if (userAvatar != null && !userAvatar.startsWith("http")) {
        userAvatar = `${config.baseURL}/${config.userAvatarPath}/${userAvatar}`;
      }
      let background_image = user.backgroundImage; // 背景图
      if (background_image != null && !background_image.startsWith("http")) {
        background_image = `${config.baseURL}/${config.userBackgroundPath}/${background_image}`;
      }
      console.log("success");
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          userId: user._id,
          userAvatar: userAvatar,
          username: user.username,
          customId: user.customId,
          profile: user.profile,
          gender: user.gender,
          backgroundImage: background_image, // 用户头像的 URL
          follow: user.follow,
          fans: user.fans,
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
//推荐好友给用户
router.get("/findUsers", authenticateToken, async (req, res) => {
  // 获取token中的用户id
  const { searchContent } = req.query;
  console.log("searchContent:", searchContent);
  // 用户数据加载 每次加载count张
  const count = parseInt(req.query.count);
  const userId = req.user.id;
  // console.log(userId);
  try {
    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { username: { $regex: searchContent, $options: "i" } }, // 使用正则表达式进行模糊查询用户名，忽略大小写
        {
          customId:
            searchContent === "" || isNaN(searchContent)
              ? -1
              : parseInt(searchContent),
        }, // 使用正则表达式进行模糊查询customId，忽略大小写
      ],
    })
      .select("_id username userAvatar profile")
      .limit(count);
    console.log(users);
    if (users) {
      const newUsers = users.map((user) => {
        let avatar = user.userAvatar; //用户头像
        if (avatar != null && !avatar.startsWith("http")) {
          avatar = `${config.baseURL}/${config.userAvatarPath}/${avatar}`;
        }
        console.log(avatar);
        const newItem = {
          userId: user._id,
          username: user.username,
          userAvatar: avatar,
          profile: user.profile,
        };
        return newItem;
      });

      console.log("success");
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: newUsers,
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
//获取用户关注的所有用户
router.get("/findFollowUsers", authenticateToken, async (req, res) => {
  // 获取token中的用户id
  const { searchContent } = req.query;
  // console.log("searchContent:", searchContent);
  // 用户数据加载 每次加载count张
  const count = parseInt(req.query.count);
  const userId = req.user.id;
  console.log(userId);
  try {
    const users = await Focus.aggregate([
      // 第一阶段：根据当前用户的 ID 查找其关注的用户 ID
      {
        $match: {
          $and: [
            { followerId: new ObjectId(userId) }, // 需要转换数据类型
            { beFollowedId: { $ne: new ObjectId(userId) } },
          ],
        },
      },
      // 第二阶段：联合查询获取关注的用户信息
      {
        $lookup: {
          from: "users", // 用户集合名称
          localField: "beFollowedId", // Focus 集合中的被关注者 ID 字段
          foreignField: "_id", // User 集合中的用户 ID 字段
          as: "user", // 存储联合后的用户信息数组
        },
      },
      // 第三阶段：根据搜索内容筛选游客号或用户名，为空则显示全部好友
      {
        $match: {
          $or: [
            { "user.username": { $regex: searchContent, $options: "i" } }, // 使用正则表达式进行模糊查询用户名，忽略大小写
            {
              "user.customId":
                searchContent === "" || isNaN(searchContent)
                  ? -1
                  : parseInt(searchContent),
            }, // 使用正则表达式进行模糊查询customId，忽略大小写
          ],
        },
      },
      // 第四阶段：筛选出需要的用户信息字段
      {
        $project: {
          "user._id": 1,
          "user.username": 1,
          "user.userAvatar": 1,
          "user.profile": 1,
        },
      },
      // 第五阶段：每次只取count条数据
      { $limit: count },
    ]);
    // console.log(users);

    if (users) {
      const newUsers = users.map((item) => {
        // console.log(item.user[0]);
        let avatar = item.user[0].userAvatar; //用户头像
        if (avatar != null && !avatar.startsWith("http")) {
          avatar = `${config.baseURL}/${config.userAvatarPath}/${avatar}`;
        }
        // console.log(avatar);
        const newItem = {
          userId: item.user[0]._id,
          username: item.user[0].username,
          userAvatar: avatar,
          profile: item.user[0].profile,
        };
        return newItem;
      });

      console.log("success", newUsers);
      res.status(200).json({
        status: "success",
        data: newUsers,
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

//获取用户的粉丝
router.get("/findFollowedUsers", authenticateToken, async (req, res) => {
  // 获取token中的用户id
  const { searchContent } = req.query;
  // console.log("searchContent:", searchContent);
  // 用户数据加载 每次加载count张
  const count = parseInt(req.query.count);
  const userId = req.user.id;
  console.log(userId);
  try {
    const users = await Focus.aggregate([
      // 第一阶段：根据当前用户的 ID 查找其关注的用户 ID
      {
        $match: {
          $and: [
            { beFollowedId: new ObjectId(userId) }, // 需要转换数据类型
            { followerId: { $ne: new ObjectId(userId) } },
          ],
        },
      },
      // 第二阶段：联合查询获取关注的用户信息
      {
        $lookup: {
          from: "users", // 用户集合名称
          localField: "followerId", // Focus 集合中的被关注者 ID 字段
          foreignField: "_id", // User 集合中的用户 ID 字段
          as: "user", // 存储联合后的用户信息数组
        },
      },
      // 第三阶段：根据搜索内容筛选游客号或用户名，为空则显示全部好友
      {
        $match: {
          $or: [
            { "user.username": { $regex: searchContent, $options: "i" } }, // 使用正则表达式进行模糊查询用户名，忽略大小写
            {
              "user.customId":
                searchContent === "" || isNaN(searchContent)
                  ? -1
                  : parseInt(searchContent),
            }, // 使用正则表达式进行模糊查询customId，忽略大小写
          ],
        },
      },
      // 第四阶段：筛选出需要的用户信息字段
      {
        $project: {
          "user._id": 1,
          "user.username": 1,
          "user.userAvatar": 1,
          "user.profile": 1,
        },
      },
      // 第五阶段：每次只取count条数据
      { $limit: count },
    ]);
    // console.log(users);

    if (users) {
      const newUsers = users.map((item) => {
        // console.log(item.user[0]);
        let avatar = item.user[0].userAvatar; //用户头像
        if (avatar != null && !avatar.startsWith("http")) {
          avatar = `${config.baseURL}/${config.userAvatarPath}/${avatar}`;
        }
        // console.log(avatar);
        const newItem = {
          userId: item.user[0]._id,
          username: item.user[0].username,
          userAvatar: avatar,
          profile: item.user[0].profile,
        };
        return newItem;
      });

      console.log("success", newUsers);
      res.status(200).json({
        status: "success",
        data: newUsers,
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

router.get("/getUserById/:id", async (req, res) => {
  // 获取token中的用户id
  const userId = req.params.id;
  console.log(userId);
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      let userAvatar = user.userAvatar; //用户头像
      if (userAvatar != null && !userAvatar.startsWith("http")) {
        userAvatar = `${config.baseURL}/${config.userAvatarPath}/${userAvatar}`;
      }
      let background_image = user.backgroundImage; // 背景图
      if (background_image != null && !background_image.startsWith("http")) {
        background_image = `${config.baseURL}/${config.userBackgroundPath}/${background_image}`;
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
      res
        .status(401)
        .json({ status: "error", message: "用户不存在或者已经注销！" });
      console.log("用户不存在或者已经注销！");
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
    await saveImage(imageData[0], config.userBackgroundPath, imagesUrl);
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
        background_image = `${config.baseURL}/${config.userBackgroundPath}/${background_image}`;
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
    saveImage(imageData[0], config.userAvatarPath, imagesUrl);
    //更新用户的背景图片
    console.log(userId);
    const result = await User.updateOne(
      { _id: userId },
      { $set: { userAvatar: imagesUrl } }
    );
    console.log(result); // 打印更新操作的结果信息
    if (result.modifiedCount > 0) {
      console.log("success");
      let userAvatar_image = imagesUrl;
      if (userAvatar_image != null && !userAvatar_image.startsWith("http")) {
        userAvatar_image = `${config.baseURL}/${config.userAvatarPath}/${userAvatar_image}`;
      }
      res.status(200).json({
        status: "success",
        message: "update successful",
        data: {
          url: userAvatar_image, // 用户头像的 URL
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
// 判断当前用户是否关注过该用户
router.get("/checkFocus/:beFollowedId", authenticateToken, async (req, res) => {
  const beFollowedId = req.params.beFollowedId;
  const followerId = req.user.id;
  try {
    // 查询点赞记录
    const focus = await Focus.findOne({ followerId, beFollowedId });
    // console.log(travelLogId, userId);
    if (focus) {
      // 如果存在点赞记录，则返回用户已经点赞
      // console.log("find");
      res.json({ focused: true });
    } else {
      // 如果不存在点赞记录，则返回用户未点赞
      // console.log("not find");
      res.json({ focused: false });
    }
  } catch (error) {
    console.error("Error checking like:", error);
    res.status(500).send("Internal server error");
  }
});

// 用户关注/取消关注特定游记
router.post("/focus", authenticateToken, async (req, res) => {
  const { beFollowedId } = req.body;
  const followerId = req.user.id;
  try {
    // 检查是否已经关注
    const focus = await Focus.findOne({ followerId, beFollowedId });
    if (focus) {
      // 如果已经关注，则移除该条记录
      await Focus.deleteOne({ _id: focus._id });
      // 查找用户并更新关注数
      const user = await User.findByIdAndUpdate(
        followerId,
        { $inc: { follow: -1 } } // 使用 $inc 操作符将点赞数-1
      );
      if (!user) {
        res.status(404).send("TravelLog not found");
      } else {
        //查找用户并更新粉丝数
        const befollowedUser = await User.findByIdAndUpdate(
          beFollowedId,
          { $inc: { fans: -1 } } // 使用 $inc 操作符将点赞数-1
        );
        if (!befollowedUser) {
          console.log("账号已注销！！");
        }
        res.json({ focused: false });
      }
    } else {
      // 如果没有点赞，则点赞
      const newFocus = new Focus({ followerId, beFollowedId });
      await newFocus.save();
      // 查找游记并更新点赞数
      const user = await User.findByIdAndUpdate(
        followerId,
        { $inc: { follow: 1 } } // 使用 $inc 操作符将关注数+1
      );
      if (!user) {
        res.status(404).send("TravelLog not found");
      } else {
        //查找用户并更新粉丝数
        const befollowedUser = await User.findByIdAndUpdate(
          beFollowedId,
          { $inc: { fans: 1 } } // 使用 $inc 操作符将粉丝数-1
        );
        if (!befollowedUser) {
          console.log("账号已注销！！");
        }
        res.json({ focused: true });
      }
    }
  } catch (error) {
    console.error("Error like:", error);
    res.status(500).send("Internal server error");
  }
});

//用户信息更改
router.put("/update", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const userData = req.body;

  try {
    // 根据 userId 查找用户
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });

    if (user) {
      res
        .status(200)
        .json({ status: "success", message: "用户信息已更新", data: user });
    } else {
      res.status(404).json({ status: "error", message: "未找到用户" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ status: "error", message: "更新用户信息时出错" });
  }
});

module.exports = router;
