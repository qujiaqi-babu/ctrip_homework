import React from "react";
import { Carousel, Button, Card, Flex, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const App = () => {
  const images = [
    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  ];
  return (
    <Card
      hoverable
      style={{ width: "100%" }}
      styles={{ body: { padding: 20, overflow: "hidden" } }}
    >
      <Flex style={{ position: "absolute", top: 10, left: 500,}}>
        <div
          style={{
            width: 70,
            height: 70,
            textAlign: "center",
            border: "4px solid #ccc",
            borderRadius: "50%",
            boxSizing: "border-box",
          }}
        >
          <Typography style={{ color: "gray", padding: 5, marginTop: 15, fontSize: 16, }}>待审核</Typography>
        </div>
      </Flex>
      <Flex justify="space-between">
        <Carousel style={{ width: 160, height: 160 }}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt="example" style={{ width: "100%" }} />
            </div>
          ))}
        </Carousel>
        <Flex vertical style={{ marginLeft: 20 }}>
          <Flex justify="flex-end">
            <CloseOutlined style={{ fontSize: "20px", color: "gray" }} />
          </Flex>
          <Typography.Title level={3} style={{ margin: 0, padding: "4px" }}>
            Title
          </Typography.Title>
          <div
            style={{
              maxHeight: "120px",
              overflowY: "auto",
            }}
          >
            <Typography.Paragraph style={{ fontSize: 18 }}>
              “antd is an enterprise-class UI design language and React UI
              library.” “antd is an enterprise-class UI design language and
              React UI library.”
            </Typography.Paragraph>
          </div>
          <Flex justify="flex-end" style={{ marginTop: 10 }}>
            <Button type="primary" style={{ marginRight: 10 }}>
              通过
            </Button>
            <Button>拒绝</Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
export default App;
