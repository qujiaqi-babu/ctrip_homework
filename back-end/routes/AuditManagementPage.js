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
      return res.status(400).json({ message: "用户名不正确，请重新输入" });
    }
    // 验证密码是否正确
    // const valid = await bcrypt.compare(password, manager.password);
    // if (!valid) {
    //   return res.status(400).send("密码不正确，请重新输入");
    // }
    if (password !== user.password) {
      return res.status(400).json({ message: "密码不正确，请重新输入" });
    }
    // 设置 session
    req.session.user = user;
    res.json({ message: "管理员登录成功！", userId: user._id, user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "管理员登录失败" });
  }
});

// 退出登录
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "管理员登出成功" });
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

// 将Date对象转换成北京时间字符串 如：'2024/04/07 15:03:52'
const convertDateToString = (date) => {
  const formattedDate = new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = new Date(date).toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${formattedDate} ${formattedTime}`;
};

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
      const newItem = {
        _id: item._id,
        title: item.title,
        content: item.content,
        imagesUrl: imagesUrl,
        state: item.state,
        editTime: convertDateToString(item.editTime),
      };
      return newItem;
    });

    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "游记列表获取失败" }); // 如果出现错误，返回500错误
  }
});

// 更新游记状态
router.put("/stateUpdate/:id", async (req, res) => {
  try {
    const travelLogId = req.params.id; // 获取 URL 中的 id 参数
    const { state, instruction } = req.body;
    const updateTime = Date.now(); // 状态更新时间
    const travelLog = await TravelLog.findOneAndUpdate(
      { _id: travelLogId },
      {
        $set: {
          state,
          instruction,
          updateTime,
        },
      }
    );
    if (!travelLog) {
      return res.status(404).json({ message: "该游记不存在" });
    } else {
      const result = {
        travelLogId: travelLogId,
        state: state,
        instruction: instruction,
        updateTime: convertDateToString(updateTime),
      };
      // console.log(result);
      return res.json({ message: "游记状态更新成功", update: result }); // 返回更新部分的游记信息
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "游记状态更新失败" });
  }
});

// 逻辑删除游记
router.delete("/travelLogDelete/:id", async (req, res) => {
  try {
    const travelLogId = req.params.id; // 获取 URL 中的 id 参数
    const deletedTravelLog = await TravelLog.findOneAndUpdate(
      { _id: travelLogId },
      {
        $set: {
          isDelete: true,
        },
      }
    );
    if (!deletedTravelLog) {
      return res.status(404).json({ message: "该游记不存在" });
    } else {
      return res.json({
        message: "游记逻辑删除成功",
        delete: deletedTravelLog,
      }); // 返回被删除的游记信息
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "游记逻辑删除失败" });
  }
});

module.exports = router;
