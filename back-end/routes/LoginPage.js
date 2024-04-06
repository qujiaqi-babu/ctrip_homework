const express = require("express");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const router = express.Router();
const { User, TravelLog, Manager } = require("../models"); //引入模型

// 密钥，请替换为你的实际密钥
const secretKey = "king";

// 生成 JWT
function generateToken(payload) {
  const options = { expiresIn: "30d" }; // 设置过期时间

  return jwt.sign(payload, secretKey, options);
}

// 解决跨域问题...
// (此处省略解决跨域的代码)
//验证
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ status: "error", message: "请先进行登录" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ status: "error", message: "访问受限，请联系管理员" });
    }

    req.user = user;
    next();
  });
}

// 处理用户登录请求
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password: md5(password) });
    if (user) {
      const payload = { id: user._id };
      const token = generateToken();
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: { token },
      });
    } else {
      res.status(401).json({ status: "error", message: "用户名或密码不正确" });
      console.log("Invalid username or password");
    }
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ status: "error", message: "出错了，请联系管理员" });
  }
});

// 处理用户注册请求
router.post("/register", async (req, res) => {
  const { username, password, email, phone } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res
        .status(401)
        .json({ status: "error", message: "用户名已经存在，请换一个吧~" });
    } else {
      const newUser = new User({
        username,
        password: md5(password),
        email,
        phone,
      });
      await newUser.save();
      res
        .status(200)
        .json({ status: "success", message: "Registration successful" });
    }
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});
module.exports = router;
