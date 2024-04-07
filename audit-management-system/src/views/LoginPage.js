import React from "react";
import { Form, Input, Button, message, Typography, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { api } from "../util";
import cookie from "react-cookies";

const { Title } = Typography;

// // 表单布局
// const layout = {
//   labelCol: {
//     span: 8,
//   },
//   wrapperCol: {
//     span: 16,
//   },
// };
// const tailLayout = {
//   wrapperCol: {
//     offset: 8,
//     span: 16,
//   },
// };

// const {
//   token: { colorBgContainer, borderRadiusLG },
// } = theme.useToken();

const LoginPage = ({ handleLogin }) => {
  // const [form] = Form.useForm();
  const handleSubmit = async (values) => {
    await api
      .post("/auditManagement/login", values)
      .then((response) => {
        // console.log(response);
        // setIsLoggedIn(true);
        message.success(response.data.message); // 登录成功提示
        // 登录成功后使用cookie存储用户Id，并设置过期时间
        let expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24小时后过期
        cookie.save("userId", response.data.userId, {
          expires: expireDate,
          path: "/",
        });
        // setIsLoggedIn(true);
        handleLogin(response.data.user);
        // form.resetFields();
        // setErrorMessage("");
      })
      .catch((error) => {
        message.error(error.response.data); // 捕获并设置错误消息
        // setErrorMessage(error.response.data);
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
