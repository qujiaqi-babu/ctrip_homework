import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, Select, Space, message } from "antd";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const UserEdit = ({ loginUser }) => {
  const [form] = Form.useForm();
  const userId = useParams().id;
  const [user, setUser] = useState(null);
  const [editFinished, setEditFinished] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/user", {
          userId,
        });
        form.setFieldsValue(response.data);
        setUser(response.data);
      } catch (error) {
        form.resetFields();
        console.log(error);
      }
    };
    fetchUser();
  }, [form, userId]);

  // 调用用户编辑api
  const handleEdit = async (values) => {
    await axios
      .put(`http://localhost:5000/api/userEdit/${userId}`, values)
      .then((response) => {
        message.success(response.data.message);
        setEditFinished(true);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  };

  const onCancel = () => {
    setEditFinished(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (editFinished) {
    return <Navigate to="/user-list" />;
  }

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={handleEdit}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input disabled={userId !== loginUser._id} />
      </Form.Item>

      <Form.Item
        name="role"
        label="角色"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          allowClear
          disabled={userId === loginUser._id || loginUser.role === "user"}
        >
          <Option value="user">普通用户</Option>
          <Option value="admin">管理员</Option>
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserEdit;
