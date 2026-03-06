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
        `http://localhost:8080/api/v1/product?page=${page - 1}&size=${size}`
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
                <div style={{ height: "240px", overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                  <img
                    alt={item.name}
                    src={item.imageUrl[0]}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transition: "transform 0.5s ease" }}
                    className="card-hover-image"
                  />
                </div>
              }
            >
              <div style={{ padding: "0 4px" }}>
                <Text type="secondary" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {item.category}
                </Text>
                <Title level={5} style={{ margin: "4px 0 12px", height: "48px", overflow: "hidden" }}>
                  {item.name}
                </Title>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong style={{ color: "#c0392b", fontSize: "1.1rem" }}>
                    {item.price?.toLocaleString()} đ
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
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
