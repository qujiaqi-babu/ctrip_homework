import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Table, Button, message } from "antd";

const UserList = ({ loginUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/userList");
        setUsers(response.data);
      } catch (error) {
        console.error("获取用户列表失败", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/userEdit/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      message.success("删除成功");
    } catch (error) {
      console.error("删除用户失败", error);
    }
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          {(loginUser.role === "admin" || loginUser._id === record._id) && (
            <NavLink to={`/users/${record._id}/edit`}>Edit</NavLink>
          )}
          {loginUser.role === "admin" && loginUser._id !== record._id && (
            <span style={{ marginLeft: "30px" }}>
              <Button
                type="link"
                danger
                onClick={() => handleDelete(record._id)}
              >
                Delete
              </Button>
            </span>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      {loginUser.role === "admin" && (
        <Button type="primary" style={{ margin: "10px" }}>
          <NavLink to={`/users/add`}>Add</NavLink>
        </Button>
      )}
      <Table dataSource={users} columns={columns} rowKey="_id" />
    </>
  );
};

export default UserList;
