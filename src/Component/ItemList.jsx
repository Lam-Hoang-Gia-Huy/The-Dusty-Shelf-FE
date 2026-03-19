import React, { useEffect, useState } from "react";
import { Card, Col, Row, Alert, Pagination, Typography, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import moment from "moment";
import useAuth from "./Hooks/useAuth";

const { Title, Text } = Typography;

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const { auth } = useAuth();

  const navigate = useNavigate();

  const fetchProducts = async (page, size) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product?page=${page - 1}&size=${size}`
      );
      const productsData = response.data.content;
      const filteredProducts =
        auth?.role === "ADMIN" || auth?.role === "STAFF"
          ? productsData
          : productsData.filter((product) => product.status === true);

      setItems(filteredProducts);
      setTotalElements(response.data.totalElements);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [auth, currentPage, pageSize]);

  const getTimeSincePost = (postDate) => {
    const now = moment();
    const postDateMoment = moment(postDate);
    const duration = moment.duration(now.diff(postDateMoment));

    if (duration.asMinutes() < 60) {
      return `${Math.floor(duration.asMinutes())}m ago`;
    } else if (duration.asHours() < 24) {
      return `${Math.floor(duration.asHours())}h ago`;
    } else {
      return `${Math.floor(duration.asDays())}d ago`;
    }
  };

  const handleItemClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert
        message="Connection Error"
        description="We're having trouble reaching the server. Please try again later."
        type="error"
        showIcon
        style={{ margin: "20px", borderRadius: "10px" }}
      />
    );
  }

  return (
    <div style={{ paddingBottom: "40px" }}>
      <Row gutter={[24, 24]}>
        {items.map((item) => (
          <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="premium-product-card"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease"
              }}
              onClick={() => handleItemClick(item.id)}
              cover={
                <div style={{ height: "320px", overflow: "hidden", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    alt={item.name}
                    src={item.imageUrl[0]}
                    style={{ height: "100%", width: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    className="card-hover-image"
                  />
                </div>
              }
            >
              <div style={{ padding: "16px 12px" }}>
                <Text type="secondary" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "#1890ff" }}>
                  {item.category}
                </Text>
                <Title level={5} style={{ margin: "8px 0 4px", fontSize: "16px", fontWeight: "600", height: "44px", overflow: "hidden", lineHeight: "1.4" }}>
                  {item.name}
                </Title>
                <div style={{ marginBottom: "8px" }}>
                  <Text type="secondary" style={{ fontSize: "13px", fontStyle: "italic", color: "#555" }}>
                    by {item.author || "Unknown Author"}
                  </Text>
                </div>
                {item.description && (
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      marginBottom: "8px",
                      lineHeight: "1.5",
                      height: "36px",
                    }}
                  >
                    {item.description}
                  </Text>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <Text strong style={{ color: "#d32f2f", fontSize: "1.2rem", fontWeight: "700" }}>
                    {item.price?.toLocaleString()} đ
                  </Text>
                  <Text type="secondary" style={{ fontSize: "11px", background: "#f0f2f5", padding: "2px 8px", borderRadius: "10px" }}>
                    {getTimeSincePost(item?.createdDate)}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalElements}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          showTotal={(total) => `Total ${total} products`}
        />
      </div>
    </div>
  );
};

export default ItemList;
