import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Drawer,
  Input,
  Space,
  FloatButton,
  Form,
  Row,
  Col,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { api } from "../util";
import cookie from "react-cookies";

const { Search } = Input;
const { Option } = Select;

const RequestStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const UserList = () => {
  const [searchText, setSearchText] = useState("");
  const [managerList, setManagerList] = useState([]);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true); // 定义下拉选择框状态，只有编辑状态下才能点击
  const [requestStatus, setRequestStatus] = useState(RequestStatus.IDLE);

  const [form] = Form.useForm();
  const role = cookie.load("role");

  // 定义表格
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (text, record) => {
        if (role === "superAdmin") {
          return (
            <Select
              defaultValue={text}
              style={{ width: 120 }}
              onChange={(value) => handleEditRole(record._id, value)}
              variant="borderless"
              disabled={disabled}
            >
              <Option value="admin">管理员</Option>
              <Option value="audit">审核人员</Option>
            </Select>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {role === "superAdmin" && <a onClick={() => handleEdit()}>编辑</a>}
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  // 抽屉表单
  // const showDrawer = () => {
  //   setOpen(true);
  // };
  const onClose = () => {
    setOpen(false);
  };

  // 获取数据
  useEffect(() => {
    // 从数据库中拿数据
    const fetchData = async () => {
      try {
        const params = {
          searchContent: searchText,
          role: role,
        };
        const response = await api.get("/auditManagement/adminUser", {
          params,
        });
        // console.log(response.data);
        setManagerList(response.data);
        setRequestStatus(RequestStatus.SUCCESS);
      } catch (error) {
        setRequestStatus(RequestStatus.ERROR);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchText]);

  // 搜索操作
  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  // 提交表单数据
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    onClose();
    try {
      const response = await api.post("/auditManagement/addUser", values);
      console.log(response.data);
      message.success("用户添加成功");
      // 提交成功后，执行页面刷新
      window.location.reload();
    } catch (error) {
      console.error("Error adding data:", error);
      message.error(error.response.data.message);
    }
  };

  // 删除操作
  const handleDelete = async (record) => {
    try {
      await api
        .delete(`/auditManagement/deleteUser/${record._id}`)
        .then((res) => {
          console.log(res.data);
          message.success("删除成功");
          window.location.reload();
        });
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("删除失败");
    }
  };

  // 编辑动作，点击可编辑，再点击关闭编辑
  const handleEdit = () => {
    setDisabled(!disabled);
  };

  // 编辑操作
  const handleEditRole = async (id, value) => {
    try {
      await api
        .put(`/auditManagement/editUser/${id}`, { role: value })
        .then((res) => {
          console.log(res.data);
          message.success("角色修改成功");
        });
    } catch (error) {
      console.error("Error editing data:", error);
      message.error("角色修改失败");
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <Search
          placeholder="input search text"
          allowClear
          enterButton
          size="large"
          style={{ width: "60%", marginBottom: "20px" }}
          onSearch={handleSearchChange}
        />
        <FloatButton
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        />
        <Drawer
          title={
            <div
              style={{ fontWeight: "normal", fontSize: 14, textAlign: "left" }}
            >
              添加人员信息
            </div>
          }
          placement="right"
          // closable={false}
          onClose={onClose}
          open={open}
          getContainer={false}
          width={"30%"}
          extra={
            <Space>
              <Button type="primary" onClick={() => form.submit()}>
                提交
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[
                    {
                      required: true,
                      message: "Please enter user name",
                    },
                  ]}
                >
                  <Input placeholder="Please enter user name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="密码"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input password!",
                    },
                  ]}
                >
                  <Input placeholder="Please enter password" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="角色"
                  rules={[
                    {
                      required: true,
                      message: "Please select an owner",
                    },
                  ]}
                >
                  <Select placeholder="Please select an role">
                    {role === "superAdmin" && (
                      <Option value="admin">管理员</Option>
                    )}
                    <Option value="audit">审核人员</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
      {requestStatus === RequestStatus.SUCCESS && (
        <Table columns={columns} dataSource={managerList} />
      )}
    </div>
  );
};

export default UserList;
