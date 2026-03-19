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

  const [books, setBooks] = useState({
    unappraised: [],
    sold: [],
    onSell: [],
  });
  const [selectedSection, setSelectedSection] = useState("unappraised");
  const { auth } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product`);
        const booksData = response.data;
        const sellerBooks = booksData.filter(
          (book) => book.sellerId == auth.id
        );
        const categorizedBooks = {
          unappraised: sellerBooks.filter(
            (book) => book.status === true && book.appraisalId === null
          ),
          sold: sellerBooks.filter(
            (book) => book.status === false && book.paid === true
          ),
          onSell: sellerBooks.filter(
            (book) =>
              book.status === true &&
              book.appraisalId !== null &&
              book.paid === false
          ),
        };

        setBooks(categorizedBooks);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };

    fetchBooks();
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

  const renderBooks = () => {
    const sectionBooks = books[selectedSection] || [];
    if (sectionBooks.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "280px",
          }}
        >
          <Empty description={`No ${selectedSection} books available`} />
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {sectionBooks.map((book) => (
          <Col key={book.id} span={24}>
            <Card
              hoverable
              style={{ backgroundColor: "#e3cbcb" }}
            >
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <img
                    alt={book.name}
                    src={book.imageUrl[0]}
                    style={{
                      width: "100%",
                      maxHeight: "130px",
                      objectFit: "contain",
                    }}
                  />
                </Col>
                <Col span={16}>
                  <Card.Meta
                    title={book.name}
                    description={
                      <>
                        <p>Author: {book.author}</p>
                        <p>Description: {book.description}</p>
                        <p>
                          Date:{" "}
                          {new Date(book.createdDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </p>
                        <p>Price: {book.price?.toLocaleString()} đ</p>
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
          {renderBooks()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyPost;
