const express = require("express");
const { TravelLog, Manager } = require("../models");
const { convertDateToString } = require("../utils/timeManager");
const config = require("../config.json");
const router = express.Router();
const bcrypt = require("bcryptjs");

// 添加用户信息
router.post("/addUser", async (req, res) => {
  const { username, password, role } = req.body;
  // 检查用户名是否已存在
  const userExists = await Manager.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: "用户名已存在，请重新输入" });
  }
  try {
    // 使用 bcryptjs 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(password, 10); // 使用 10 轮的哈希加密
    const user = new Manager({
      username,
      password: hashedPassword,
      role,
    });
    await user.save();
    console.log("用户添加成功");
    res.json({ message: "用户添加成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "用户添加失败" });
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
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "密码不正确，请重新输入" });
    }
    // if (password !== user.password) {
    //   return res.status(400).json({ message: "密码不正确，请重新输入" });
    // }
    // 设置 session
    req.session.user = user;
    res.json({ message: "登录成功！", userId: user._id, user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "登录失败" });
  }
});

// 退出登录
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "管理员登出成功" });
});

// 删除用户
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Manager.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }
    await Manager.deleteOne({ user });
    res.json({ message: "用户删除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 编辑用户信息
router.put("/editUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.body;

    const updateUser = await Manager.findByIdAndUpdate(id, role, { new: true });
    if (!updateUser) {
      return res.status(404).json({ message: "用户不存在" });
    }
    res.json({ message: "用户信息更新成功", user: updateUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "用户角色更新失败" });
  }
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
    let state = req.query.state;
    const searchContent = req.query.searchContent;
    if (state === "全部") {
      state = "";
    }

    const travelLogs = await TravelLog.aggregate([
      {
        // 排除isDelete为true的数据
        $match: { isDelete: { $ne: true } }, // 不等于true
      },
      {
        // 排除状态为"未发布"的数据
        $match: { state: { $ne: "未发布" } }, // 不等于"未发布"
      },
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
          instruction: 1,
        },
      },
    ]);
    // 将 MongoDB 文档对象转换为普通 JavaScript 对象
    const result = travelLogs.map((item) => {
      const imagesUrl = item.imagesUrl.map(
        (imageUrl) => `${config.localhost}/${config.logUploadPath}/${imageUrl}`
      );
      const newItem = {
        _id: item._id,
        title: item.title,
        content: item.content,
        imagesUrl: imagesUrl,
        state: item.state,
        editTime: convertDateToString(item.editTime),
        instruction: item.instruction,
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

// 获取审核管理系统用户数据
router.get("/adminUser", async (req, res) => {
  try {
    const searchContent = req.query.searchContent;
    const role = req.query.role;

    // 定义匹配阶段的初始值
    let matchStage = {};

    if (role === "superAdmin") {
      matchStage = { username: { $regex: searchContent, $options: "i" } };
    } else {
      matchStage = {
        username: { $regex: searchContent, $options: "i" },
        role: "audit",
      };
    }

    const managers = await Manager.aggregate([
      {
        // 游记状态筛选并查找标题或内容与搜索内容匹配的游记
        $match: {
          $and: [matchStage, { role: { $ne: "superAdmin" } }],
        },
      },
      {
        // 从文档中选择并返回指定的字段
        $project: {
          _id: 1,
          username: 1,
          password: 1,
          userAvatar: 1,
          role: {
            $switch: {
              branches: [
                { case: { $eq: ["$role", "admin"] }, then: "管理员" },
                { case: { $eq: ["$role", "audit"] }, then: "审核人员" },
              ],
              default: "$role",
            },
          },
        },
      },
    ]);

    // 将 MongoDB 文档对象转换为普通 JavaScript 对象
    const result = managers.map((item) => {
      const newItem = {
        _id: item._id,
        username: item.username,
        password: item.password,
        userAvatar: item.userAvatar,
        role: item.role,
      };
      return newItem;
    });

    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "用户列表获取失败" }); // 如果出现错误，返回500错误
  }
});

module.exports = router;
