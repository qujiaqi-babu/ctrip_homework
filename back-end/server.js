const express = require("express");
const session = require("express-session"); // 将数据以session的形式保存在服务端
const cookieParser = require("cookie-parser"); // 通过cookie将数据保存在在客户端中
const cors = require("cors");
const bcrypt = require("bcrypt");
const { User, TravelLog, TravelLogState, Manager } = require("./models");

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);

// 密码格式验证 至少包含1个数字、1个大写字母、1个小写字母 密码包含6-18位数字/字母
const checkPassword = (password) => {
  return /^(?![0-9]+$)(?![A-Z]+$)(?![a-z]+$)[0-9A-Za-z]{6,18}$/.test(password);
};

// 获取当前用户信息
app.post("/api/user", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(401).json({ message: "请先登录系统" });
  }
  try {
    // 在这里根据用户 ID 获取当前用户信息
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "请先登录系统" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "获取用户信息失败" });
  }
});

// 用户注册
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    // 检查是否已存在同名用户
    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(400).send("用户名有误，该用户名已存在");
    }
    // 检查密码是否合法
    const validPassword = checkPassword(password);
    if (!validPassword) {
      return res
        .status(400)
        .send(
          "密码有误，至少包含1个数字、1个大写字母、1个小写字母的6-18位密码"
        );
    }
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    // 创建新用户
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).send("用户注册成功！");
  } catch (err) {
    console.error(err);
    res.status(500).send("服务器出错啦！用户注册失败，请稍后重试~");
  }
});

// 用户登录
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // 检查用户是否存在
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("用户名不正确，请重新输入");
    }
    // 验证密码是否正确
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).send("密码不正确，请重新输入");
    }
    // 设置 session
    req.session.user = user;
    res
      .status(201)
      .send({ message: "用户登录成功！", userId: user._id, user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send("服务器出错啦！用户登录失败，请稍后重试~");
  }
});

// 退出登录
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

// // 获取用户列表
// app.get("/api/userList", async (req, res) => {
//   try {
//     const users = await User.find({}, "username email role");
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
