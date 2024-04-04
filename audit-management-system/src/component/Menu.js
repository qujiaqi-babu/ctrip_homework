import React from "react";
import {
  HomeOutlined,
  MailOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

const App = ({ isLoggedIn, handleLogout }) => {
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const register = <NavLink to="/register">注册</NavLink>;
  const login = <NavLink to="/login">登录</NavLink>;
  const logout = <span onClick={handleLogout}>退出登录</span>;
  const userList = <NavLink to="/user-list">用户列表</NavLink>;
  const permissionList = <NavLink to="/permission-list">权限列表</NavLink>;

  const items_default = [
    getItem("账号管理", "1", <HomeOutlined />, [
      getItem(register, "register", <MailOutlined />),
      getItem(login, "login", <UserOutlined />),
    ]),
    {
      type: "divider",
    },
    getItem("权限管理", "2", <AppstoreOutlined />, [
      getItem(userList, "userList", <TeamOutlined />),
      getItem(permissionList, "permissionList", <ToolOutlined />),
    ]),
  ];

  const items_isLoggedIn = [
    getItem("账号管理", "1", <HomeOutlined />, [
      getItem(logout, "logout", <LogoutOutlined />),
    ]),
    {
      type: "divider",
    },
    getItem("权限管理", "2", <AppstoreOutlined />, [
      getItem(userList, "userList", <TeamOutlined />),
      getItem(permissionList, "permissionList", <ToolOutlined />),
    ]),
  ];

  return (
    <Menu
      defaultSelectedKeys={["login"]}
      defaultOpenKeys={["1", "2"]}
      mode="inline"
      items={isLoggedIn ? items_isLoggedIn : items_default}
    />
  );
};

export default App;
