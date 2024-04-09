const jwt = require("jsonwebtoken");
const config = require("../config.json");
// 密钥，请替换为你的实际密钥
const secretKey = config.secretKey;
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  // console.log(token);
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
    // console.log(req.user);
    next();
  });
};

module.exports = { authenticateToken };
