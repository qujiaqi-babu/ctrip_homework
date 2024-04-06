import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { api } from "../util";
import gifBackground from "../assets/Trip.comGroup.gif";
import cookie from "react-cookies";
const { Title } = Typography;
// 表单布局
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

// const {
//   token: { colorBgContainer, borderRadiusLG },
// } = theme.useToken();

const LoginPage = ({ setIsLoggedIn }) => {
  // const [form] = Form.useForm();
  const handleSubmit = async (values) => {
    await api
      .post("/auditManagement/login", values)
      .then((response) => {
        // console.log(response);
        message.success(response.data.message); // 登录成功提示
        // 登录成功后使用cookie存储用户Id，并设置过期时间
        let expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24小时后过期
        cookie.save("userId", response.data.userId, {
          expires: expireDate,
          path: "/",
        });
        setIsLoggedIn(true);
        // form.resetFields();
        // setErrorMessage("");
      })
      .catch((error) => {
        message.error(error.response.data); // 捕获并设置错误消息
        // setErrorMessage(error.response.data);
      });
  };
  return (
    <div
      style={{
        backgroundImage: `url(${gifBackground})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        // flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          // width: "300px",
          borderRadius: "10px",
          padding: "0px 20px",
          // display: "flex",
          // justifyContent: "flex-end",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
          游记审核管理系统
        </Title>
        <Form {...layout} name="login" onFinish={handleSubmit}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
