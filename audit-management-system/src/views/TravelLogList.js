import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import { Row, Col, Flex, Input, Dropdown, Typography, Space,  } from "antd";
import TravelLogCard from "../component/TravelLogCard";

const { Search } = Input;

const items = [
  {
    key: "1",
    label: "待审核",
  },
  {
    key: "2",
    label: "已通过",
  },
  {
    key: "3",
    label: "未通过",
  },
];

const TravelLogList = () => {
  const [selectState, setSelectState] = useState("");

  useEffect(() => {
    // 从数据库中拿数据
  });

  const onSearch = (value) => {
    // 搜索逻辑

  };

  const handleSelectState = (item) => {
    const selectedItem = items.find((state) => state.key === item.key);
    setSelectState(selectedItem ? selectedItem.label : "");
  }

  return (
    <div style={{ flex: 1 }}>
      <Flex justify="space-between" style={{ marginBottom: 20, }}>
        <div style={{ flex: 2 }}>
          <Dropdown
            menu={{ items, selectable: true, defaultOpenKeys: ["1"], onClick: handleSelectState,}}
            placement="bottomLeft"

          >
            <Typography.Link>
              <Space>
                {selectState ? selectState : '游记状态'}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </div>
        <div style={{flex: 6}}>
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
          />
        </div>
      </Flex>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <TravelLogCard />
        </Col>
        <Col span={12}>
          <TravelLogCard />
        </Col>
      </Row>
    </div>
  );
};

export default TravelLogList;
