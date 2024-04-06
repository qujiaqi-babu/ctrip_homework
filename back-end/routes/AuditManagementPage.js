const express = require("express");
const { User, TravelLog, Manager } = require("../models");
const config = require("../config.json");
const router = express.Router();

// 管理员注册
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new Manager({
      username,
      password,
    });
    await user.save();
    console.log("管理员添加成功");
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("管理员添加失败"));
  }
});

// 管理员登录
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // 检查用户是否存在
    const user = await Manager.findOne({ username });
    if (!user) {
      return res.status(400).send("用户名不正确，请重新输入");
    }
    // 验证密码是否正确
    // const valid = await bcrypt.compare(password, manager.password);
    // if (!valid) {
    //   return res.status(400).send("密码不正确，请重新输入");
    // }
    if (password !== user.password) {
      return res.status(400).send("密码不正确，请重新输入");
    }
    // 设置 session
    req.session.user = user;
    res
      .status(201)
      .send({ message: "管理员登录成功！", userId: user._id, user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send("服务器出错啦！管理员登录失败，请稍后重试~");
  }
});

// 退出登录
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

// 获取当前用户信息
router.get("/userInfo", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ message: "请先登录系统" });
  }

  try {
    // 在这里根据用户 ID 获取当前用户信息
    const user = await Manager.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "请先登录系统" });
    }
    res.json(user);
    // console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "获取用户信息失败" });
  }
});

router.get("/travelLogs", async (req, res) => {
  try {
    const { searchContent, state } = req.query;
    // console.log(selectedTopic);
    const selectedFields = {
      _id: 1,
      title: 1,
      content: 1,
      imagesUrl: 1,
      userId: 1,
      state: 1,
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
          userId: item.userId,
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
