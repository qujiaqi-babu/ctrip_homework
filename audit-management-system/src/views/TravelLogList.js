import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Flex,
  Input,
  Dropdown,
  Typography,
  Space,
  Pagination,
} from "antd";
import TravelLogCard from "../component/TravelLogCard";
import { api } from "../util";

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
  {
    key: "4",
    label: "全部",
  },
];

const RequestStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const TravelLogList = () => {
  const [selectState, setSelectState] = useState("");
  const [searchText, setSearchText] = useState("");
  const [travelLogs, setTravelLogs] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4); // 每页显示4条待审核的内容

  const startIndex = (currentPage - 1) * pageSize; // 计算起始索引
  const endIndex = currentPage * pageSize; // 计算结束索引
  const currentData = travelLogs?.slice(startIndex, endIndex); // 获取当前页的数据

  const [requestStatus, setRequestStatus] = useState(RequestStatus.IDLE);

  // 状态改变函数
  const handleStateChange = (index, state, instruction) => {
    // console.log("状态改变", index, state, instruction);
    const newTravelLogs = [...travelLogs];
    newTravelLogs[index].state = state;
    newTravelLogs[index].instruction = instruction;
    setTravelLogs(newTravelLogs);
  };

  // 处理删除操作
  const handleDelete = (index) => {
    const id = travelLogs[index]._id;
    const updateLogs = travelLogs.filter((log) => log._id !== id);
    setTravelLogs(updateLogs);
  }

  useEffect(() => {
    // 从数据库中拿数据
    const fetchData = async () => {
      try {
        const params = {
          state: selectState,
          searchContent: searchText,
        };
        const response = await api.get("/auditManagement/travelLogs", {
          params,
        });
        // console.log(response.data);
        setTravelLogs(response.data);
        setRequestStatus(RequestStatus.SUCCESS);
      } catch (error) {
        setRequestStatus(RequestStatus.ERROR);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchText, selectState]);

  // 搜索
  const onSearch = async(value) => {
    setSearchText(value);

  };

  // 状态筛选
  const handleSelectState = (item) => {
    const selectedItem = items.find((state) => state.key === item.key);
    setSelectState(selectedItem ? selectedItem.label : "");
  };

  // 切换页面
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ flex: 1 }}>
      <Flex justify="space-between" style={{ marginBottom: 20 }}>
        <div style={{ flex: 2 }}>
          <Dropdown
            menu={{
              items,
              selectable: true,
              defaultOpenKeys: ["1"],
              onClick: handleSelectState,
            }}
            placement="bottomLeft"
          >
            <Typography.Link style={{ fontSize: 16 }}>
              <Space>
                {selectState ? selectState : "游记状态"}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </div>
        <div style={{ flex: 6 }}>
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
            allowClear
            // maxLength={50}
          />
        </div>
      </Flex>
      <Flex vertical>
        {requestStatus === RequestStatus.SUCCESS && (
          <Row gutter={[12, 12]}>
            {currentData.map((log, index) => (
              <Col span={24} key={index}>
                <TravelLogCard
                  logs={log}
                  index={index}
                  setTravelLogs={handleStateChange}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        )}
      </Flex>
      <Flex justify="center">
        {requestStatus === RequestStatus.SUCCESS && (
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={travelLogs.length}
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: "center" }}
          />
        )}
      </Flex>
    </div>
  );
};

export default TravelLogList;
