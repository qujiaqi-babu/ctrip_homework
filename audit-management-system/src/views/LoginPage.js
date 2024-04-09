import React from "react";
import { Form, Input, Button, message, Typography, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { api } from "../util";
import cookie from "react-cookies";

const { Title } = Typography;


const LoginPage = ({ handleLogin }) => {
  const handleSubmit = async (values) => {
    await api
      .post("/auditManagement/login", values)
      .then((response) => {
        message.success(response.data.message); // 登录成功提示
        // 登录成功后使用cookie存储用户Id，并设置过期时间
        let expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24小时后过期
        cookie.save("userId", response.data.userId, {
          expires: expireDate,
          path: "/",
        });
        handleLogin(response.data.user);
      })
      .catch((error) => {
        console.log(error);
        message.error(error.response.data.message); // 捕获并设置错误消息
      });
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "rgb(94, 98, 115)",
          }}
        >
          游记审核管理系统
        </Title>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              style={{ fontSize: "18px" }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              style={{ fontSize: "18px" }}
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ fontSize: "16px", marginBottom: "10px" }}>
              Remember me
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ fontSize: "16px", width: "100%" }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
