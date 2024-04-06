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
import cookie from "react-cookies";
import LoginForm from "./views/LoginPage";
// import LoginForm from "./views/Login copy";

import PermissionList from "./views/PermissionList";
import TravelLogList from "./views/TravelLogList";
import StateEdit from "./views/StateEdit";
import { api } from "./util";
// import "./App.css";

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
        const params = {
          userId: userId,
        };
        const response = await api.get("/auditManagement/userInfo", {
          params,
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
      await api.get("/auditManagement/logout");
      setIsLoggedIn(false);
      cookie.remove("userId");
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!isLoggedIn) return <LoginForm setIsLoggedIn={setIsLoggedIn} />;
  else {
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
                  path="/travelLogList"
                  element={<TravelLogList loginUser={user} />}
                />
                <Route
                  path="/travelLog/:id/edit"
                  element={<StateEdit loginUser={user} />}
                />
                <Route
                  path="/permissionList"
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
  }
};
export default App;
