import React, { useEffect, useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Row, Col, Card, Tag, Empty } from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth";

const { Header, Content, Sider } = Layout;

const MyPost = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [watches, setWatches] = useState({
    unappraised: [],
    sold: [],
    onSell: [],
  });
  const [selectedSection, setSelectedSection] = useState("unappraised");
  const { auth } = useAuth();

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/watch`);
        const watchesData = response.data;
        const sellerWatch = watchesData.filter(
          (watch) => watch.sellerId == auth.id
        );
        const categorizedWatches = {
          unappraised: sellerWatch.filter(
            (watch) => watch.status === true && watch.appraisalId === null
          ),
          sold: sellerWatch.filter(
            (watch) => watch.status === false && watch.paid === true
          ),
          onSell: sellerWatch.filter(
            (watch) =>
              watch.status === true &&
              watch.appraisalId !== null &&
              watch.paid === false
          ),
        };

        setWatches(categorizedWatches);
      } catch (error) {
        console.error("Error fetching watches", error);
      }
    };

    fetchWatches();
  }, [auth.id]);

  const handleMenuClick = (e) => {
    setSelectedSection(e.key);
  };

  const items2 = [
    {
      key: "unappraised",
      icon: React.createElement(UserOutlined),
      label: "Unappraised",
    },
    {
      key: "sold",
      icon: React.createElement(LaptopOutlined),
      label: "Sold",
    },
    {
      key: "onSell",
      icon: React.createElement(NotificationOutlined),
      label: "On Sell",
    },
  ];

  const renderWatches = () => {
    const sectionWatches = watches[selectedSection] || [];
    if (sectionWatches.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "280px",
          }}
        >
          <Empty description={`No ${selectedSection} watches available`} />
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {sectionWatches.map((watch) => (
          <Col key={watch.id} span={24}>
            <Card
              hoverable
              style={{ backgroundColor: "#e3cbcb" }}
            // onClick={() => handleItemClick(watch.id)}
            >
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <img
                    alt={watch.name}
                    src={watch.imageUrl[0]}
                    style={{
                      width: "100%",
                      maxHeight: "130px",
                      objectFit: "contain",
                    }}
                  />
                </Col>
                <Col span={16}>
                  <Card.Meta
                    title={watch.name}
                    description={
                      <>
                        <p>Brand: {watch.brand}</p>
                        <p>Description: {watch.description}</p>
                        <p>
                          Date:{" "}
                          {new Date(watch.createdDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </p>
                        <p>Price: {watch.price?.toLocaleString()} đ</p>
                        <Tag
                          color={selectedSection === "sold" ? "red" : "green"}
                        >
                          {selectedSection === "sold"
                            ? "Sold"
                            : selectedSection === "onSell"
                              ? "On Sell"
                              : "Unappraised"}
                        </Tag>
                      </>
                    }
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Layout>
      <Sider
        width={200}
        style={{
          background: colorBgContainer,
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["unappraised"]}
          style={{
            height: "100%",
            borderRight: 0,
          }}
          items={items2}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout
        style={{
          padding: "0 24px 24px",
        }}
      >
        <Content
          style={{
            padding: 50,
            margin: 30,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderWatches()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyPost;
