import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  FileTextOutlined,
  LogoutOutlined,
  EditOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { api } from "../util";

const App = ({ isLoggedIn, setIsLoggedIn }) => {
  const role = cookie.load("role");
  console.log("role", role);
  const navigate = useNavigate();

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const handleLogout = async () => {
    const confirmed = window.confirm("确定要退出登录吗？");
    if (confirmed) {
      await api.get("/auditManagement/logout");
      setIsLoggedIn(false);
      cookie.remove("userId");
      cookie.remove("role");
      navigate("/");
    }
  };

  const logout = <span onClick={handleLogout}>退出登录</span>;
  const travelLogList = <NavLink to="/travelLogList">游记列表</NavLink>;
  const roleInstruction = <NavLink to="/permissionList">角色说明</NavLink>;
  const userList = <NavLink to="/userList">用户列表</NavLink>;

  // 权限管理，审核人员看不到权限列表页
  const getMenuItems = () => {
    const commonItems = [
      getItem("账号管理", "1", <HomeOutlined />, [
        getItem(logout, "logout", <LogoutOutlined />),
      ]),
      {
        type: "divider",
      },
    ];

    const adminItems = [
      getItem("审核管理", "2", <AppstoreOutlined />, [
        getItem(travelLogList, "travelLogList", <EditOutlined />),
        getItem("权限列表", "3", <ToolOutlined />, [
          getItem(roleInstruction, "roleInstruction", <FileTextOutlined />),
          getItem(userList, "userList", <TeamOutlined />),
        ]),
      ]),
    ];

    const auditItems = [
      getItem("审核管理", "2", <AppstoreOutlined />, [
        getItem(travelLogList, "travelLogList", <EditOutlined />),
      ]),
    ];

    if (role === "audit") {
      return commonItems.concat(auditItems);
    } else {
      return commonItems.concat(adminItems);
    }
  };

  // const items_isLoggedIn = [
  //   getItem("账号管理", "1", <HomeOutlined />, [
  //     getItem(logout, "logout", <LogoutOutlined />),
  //   ]),
  //   {
  //     type: "divider",
  //   },
  //   getItem("审核管理", "2", <AppstoreOutlined />, [
  //     getItem(travelLogList, "travelLogList", <EditOutlined />),
  //     getItem("权限列表", "3", <ToolOutlined />, [
  //       getItem(roleInstruction, "roleInstruction", <FileTextOutlined />),
  //       getItem(userList, "userList", <TeamOutlined />),
  //     ]),
  //   ]),
  // ];

  return (
    <Menu
      defaultSelectedKeys={["travelLogList"]}
      defaultOpenKeys={["1", "2"]}
      mode="inline"
      items={getMenuItems()}
    />
  );
};

export default App;
