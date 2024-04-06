import React from "react";
import { Table } from "antd";

const PermissionList = () => {
  const columns = [
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "权限描述",
      dataIndex: "description",
      key: "description",
    },
  ];

  const roles = [
    {
      _id: "1",
      role: "admin",
      description:
        "管理员，可以执行所有支持的游记管理操作，包括通过、拒绝、删除。",
    },
    {
      _id: "2",
      role: "audit",
      description: "审核人员，可以操作游记的审核通过和拒绝。",
    },
  ];

  return <Table dataSource={roles} columns={columns} rowKey="_id" />;
};

export default PermissionList;
