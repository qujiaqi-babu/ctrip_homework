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

  const logout = <span onClick={handleLogout}>退出登录</span>;
  const travelLogList = <NavLink to="/travelLogList">游记列表</NavLink>;
  const permissionList = <NavLink to="/permissionList">权限列表</NavLink>;

  const items_isLoggedIn = [
    getItem("账号管理", "1", <HomeOutlined />, [
      getItem(logout, "logout", <LogoutOutlined />),
    ]),
    {
      type: "divider",
    },
    getItem("审核管理", "2", <AppstoreOutlined />, [
      getItem(travelLogList, "travelLogList", <TeamOutlined />),
      getItem(permissionList, "permissionList", <ToolOutlined />),
    ]),
  ];

  return (
    <Menu
      defaultSelectedKeys={["travelLogList"]}
      defaultOpenKeys={["1", "2"]}
      mode="inline"
      items={items_isLoggedIn}
    />
  );
};

export default App;
