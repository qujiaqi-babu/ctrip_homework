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
    res.json({ message: "管理员添加成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "管理员添加失败" });
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
    res.json({ message: "管理员登录成功！", userId: user._id, user: user });
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

// 获取游记列表信息
router.get("/travelLogs", async (req, res) => {
  try {
    const { searchContent, state } = req.query;

    const travelLogs = await TravelLog.aggregate([
      {
        // 游记状态筛选并查找标题或内容与搜索内容匹配的游记
        $match: {
          $and: [
            { state: { $regex: state, $options: "i" } },
            {
              $or: [
                { title: { $regex: searchContent, $options: "i" } },
                { content: { $regex: searchContent, $options: "i" } },
              ],
            },
          ],
        },
      },
      {
        // 添加一个名为 sortOrder 的新字段，其值取决于每个文档中 state 字段的值
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$state", "待审核"] }, then: 1 },
                { case: { $eq: ["$state", "未通过"] }, then: 2 },
                { case: { $eq: ["$state", "已通过"] }, then: 3 },
              ],
              default: 4, // 其他状态，默认为4
            },
          },
        },
      },
      {
        $sort: {
          sortOrder: 1, // 按游记状态排序：待审核=>未通过=>已通过（=>未发布）
          editTime: 1, // 按编辑时间顺序排序（由早及晚）
        },
      },
      {
        // 从文档中选择并返回指定的字段
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          imagesUrl: 1,
          state: 1,
          editTime: 1,
        },
      },
    ]);

    // 将 MongoDB 文档对象转换为普通 JavaScript 对象
    const result = travelLogs.map((item) => {
      const imagesUrl = item.imagesUrl.map(
        (imageUrl) => `${config.localhost}/image/${imageUrl}`
      );
      const formattedDate = item.editTime.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedTime = item.editTime.toLocaleTimeString("zh-CN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const newItem = {
        _id: item._id,
        title: item.title,
        content: item.content,
        imagesUrl: imagesUrl,
        state: item.state,
        editTime: `${formattedDate} ${formattedTime}`,
      };
      return newItem;
    });

    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("游记列表获取失败")); // 如果出现错误，返回500错误
  }
});

module.exports = router;
