import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Button, theme } from "antd";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MyMenu from "./component/Menu";
import axios from "axios";
import cookie from "react-cookies";
import RegisterForm from "./views/Register";
import LoginForm from "./views/Login";
import PermissionList from "./views/PermissionList";
import UserList from "./views/UserList";
import UserEdit from "./views/UserEdit";
import UserAdd from "./views/UserAdd";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false); // 是否收起侧边菜单栏
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 当前用户是否已登录
  const [user, setUser] = useState(null);
  const userId = cookie.load("userId");
  const roleToName = { admin: "管理员", user: "普通用户" };

  useEffect(() => {
    // 检查用户是否已登录
    const checkLoggedIn = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/user", {
          userId,
        });
        setIsLoggedIn(true);
        setUser(response.data);
      } catch (error) {
        setIsLoggedIn(false);
        console.log(error);
      }
    };
    checkLoggedIn();
  }, [userId]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("确定要退出登录吗？");
    if (confirmed) {
      await axios.post("http://localhost:5000/api/logout");
      setIsLoggedIn(false);
      cookie.remove("userId");
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ background: colorBgContainer }}
        >
          <MyMenu isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {isLoggedIn && (
              <span
                style={{
                  position: "absolute",
                  right: "30px",
                  fontSize: "16px",
                }}
              >
                <UserOutlined />
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {roleToName[user.role]}：{user.username}
                </span>
              </span>
            )}
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* 子路由 */}
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route
                path="/login"
                element={
                  !isLoggedIn ? (
                    <LoginForm handleLogin={handleLogin} />
                  ) : (
                    <Navigate to="/user-list" />
                  )
                }
              />
              <Route
                path="/user-list"
                element={
                  isLoggedIn ? (
                    <UserList loginUser={user} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/users/:id/edit"
                element={
                  isLoggedIn ? (
                    <UserEdit loginUser={user} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/users/add"
                element={isLoggedIn ? <UserAdd /> : <Navigate to="/login" />}
              />
              <Route
                path="/permission-list"
                element={
                  isLoggedIn ? <PermissionList /> : <Navigate to="/login" />
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
export default App;
