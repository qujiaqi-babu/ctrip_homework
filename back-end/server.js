const express = require("express");
const session = require("express-session"); // 将数据以session的形式保存在服务端
const cookieParser = require("cookie-parser"); // 通过cookie将数据保存在在客户端中
const cors = require("cors");

const auditManagementRoutes = require("./routes/AuditManagementPage");
const homeRoutes = require("./routes/HomePage");
const logDetailRoutes = require("./routes/LogDetailPage");
const loginRoutes = require("./routes/LoginPage");
const logPublicRoutes = require("./routes/LogPublicPage");
const myLogRoutes = require("./routes/MyLogPage");
const settingRoutes = require("./routes/SettingPage");
const userInfoRoutes = require("./routes/UserInfoPage");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;

// 设置请求体大小限制为50MB
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

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

// 静态文件目录
app.use("/image", express.static("image"));
app.use("/userAvatar", express.static("userAvatar"));

app.use("/auditManagement", auditManagementRoutes);
app.use("/home", homeRoutes);
app.use("/logDetail", logDetailRoutes);
app.use("/login", loginRoutes);
app.use("/logPublic", logPublicRoutes);
app.use("/myLog", myLogRoutes);
app.use("/setting", settingRoutes);
app.use("/userInfo", userInfoRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
