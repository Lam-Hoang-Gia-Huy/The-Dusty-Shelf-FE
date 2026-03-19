import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel, message, List, Avatar, Rate, Select, InputNumber } from "antd";
import axios from "axios";
import axiosInstance from "./Config/axiosConfig";
import { Layout, Col, Row, Button, Typography } from "antd";
import moment from "moment";
import Loading from "./Loading";
import useAuth from "./Hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ChatStartButton from "./ChatStartButton";
import "react-photo-view/dist/react-photo-view.css";

const { Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

const ProductDetail = () => {
  let { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const productResponse = await axiosInstance.get(`/api/v1/product/${id}`);
        if (isMounted) setProductData(productResponse.data);

        const feedbackResponse = await axiosInstance.get(`/api/v1/feedback/product/${id}`);
        if (isMounted) setFeedbackData(feedbackResponse.data);

        const staffResponse = await axiosInstance.get(`/api/v1/user/staff`);
        if (isMounted) setStaffList(staffResponse.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [id]);

  const addToCart = async () => {
    if (auth) {
      try {
        const cartItem = {
          product: { id: productData.id },
          quantity: quantity,
        };
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/cart/${auth.id}`,
          cartItem,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        message.success("Added to cart successfully!");
      } catch (error) {
        if (error.response && error.response.data.message) {
          message.error(error.response.data.message);
        } else {
          message.error("Failed to add to cart.");
        }
      }
    } else {
      message.info("You have to log in first!");
      navigate("/login");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!productData) {
    return (
      <Content style={{ padding: "50px", textAlign: "center" }}>
        <Typography.Title level={3}>Product not found</Typography.Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Content>
    );
  }

  const showAddToCartButton = productData.status === true;

  return (
    <Content
      style={{
        padding: "40px min(10%, 150px)",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Row
        gutter={[32, 32]}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Col span={12}>
          <Carousel arrows ref={carouselRef} afterChange={(index) => setActiveImage(index)}>
            {productData.imageUrl?.map((imageUrl, index) => (
              <div key={index}>
                <PhotoProvider>
                  <PhotoView src={imageUrl}>
                    <img
                      src={imageUrl}
                      alt={productData.name}
                      className="contentStyle"
                      style={{ borderRadius: "8px", cursor: 'zoom-in' }}
                    />
                  </PhotoView>
                </PhotoProvider>
              </div>
            ))}
          </Carousel>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {productData.imageUrl?.map((imageUrl, index) => (
              <div
                key={index}
                onClick={() => carouselRef.current.goTo(index)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: activeImage === index ? '2px solid #1890ff' : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
              >
                <img
                  src={imageUrl}
                  alt={`thumbnail-${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </Col>
        <Col xs={24} md={12} style={{ color: "#333" }}>
          <h1 style={{ color: "#222", fontSize: "28px", fontWeight: "700", marginBottom: "16px", lineHeight: "1.2" }}>
            {productData.name}
          </h1>
          <div style={{ marginBottom: "15px", display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: "16px", color: "#666", width: "120px" }}>Price: </Text>
            <Text style={{ fontSize: "20px", color: "#ff4d4f", fontWeight: "600" }}>
              {productData.price?.toLocaleString()} đ
            </Text>
          </div>
          <div style={{ marginBottom: "12px", display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: "16px", color: "#666", width: "120px" }}>Author: </Text>
            <Text style={{ fontSize: "16px", color: "#333", fontStyle: "italic" }}>
              {productData.author || "Unknown"}
            </Text>
          </div>
          <div style={{ marginBottom: "12px", display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: "16px", color: "#666", width: "120px" }}>Category: </Text>
            <Text style={{ fontSize: "16px", color: "#333" }}>{productData.category}</Text>
          </div>
          <div style={{ marginBottom: "12px", display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: "16px", color: "#666", width: "120px" }}>Stock: </Text>
            <Text style={{ fontSize: "16px", color: "#333" }}>{productData.stockQuantity} units</Text>
          </div>
          <div style={{ marginBottom: "12px", display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: "16px", color: "#666", width: "120px" }}>Posted since: </Text>
            <Text style={{ fontSize: "16px", color: "#333" }}>{moment(productData.createdDate).fromNow()}</Text>
          </div>
          <div style={{ marginBottom: "20px", display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: "16px", color: "#666", width: "120px" }}>Rating: </Text>
            <Rate disabled allowHalf value={productData.averageScore} style={{ fontSize: "14px" }} />
          </div>

          {auth && auth.role !== "ADMIN" && auth.role !== "STAFF" && (
            <div style={{ marginBottom: "24px", padding: "15px", backgroundColor: "#f0f5ff", borderRadius: "8px" }}>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Chat with Store Support:</Text>
              <Select
                placeholder="Select a staff member to chat"
                onChange={(value) => setSelectedStaffId(value)}
                style={{ width: "100%", marginBottom: "12px" }}
              >
                {staffList.map((staff) => (
                  <Option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.email})
                  </Option>
                ))}
              </Select>
              <ChatStartButton
                productId={productData.id}
                userId={auth.id}
                staffId={selectedStaffId}
              />
            </div>
          )}
          {auth && auth.role == "ADMIN" && (
            <div style={{ marginBottom: "20px" }}>
              <Button
                type="primary"
                size="large"
                style={{ borderRadius: '6px' }}
                onClick={() => navigate(`/product/update/${productData.id}`)}
              >
                Update this product
              </Button>
            </div>
          )}

          {showAddToCartButton &&
            auth &&
            auth.role !== "ADMIN" &&
            auth.role !== "STAFF" && (
              <div style={{ marginTop: "20px", padding: "20px", borderTop: "1px solid #eee" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <Text strong style={{ fontSize: "16px", color: "#333" }}>Purchase quantity:</Text>
                  <InputNumber
                    min={1}
                    max={productData.stockQuantity}
                    value={quantity}
                    onChange={(val) => setQuantity(val || 1)}
                    style={{ width: "100px", borderRadius: '4px' }}
                  />
                  <Text type="secondary" style={{ fontSize: "14px" }}>Available: {productData.stockQuantity}</Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  style={{
                    background: "#ff4d4f",
                    borderColor: "#ff4d4f",
                    height: "50px",
                    fontSize: "18px",
                    fontWeight: "600",
                    borderRadius: "8px"
                  }}
                  onClick={addToCart}
                >
                  Add to Cart <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faCartShopping} />
                </Button>
              </div>
            )}
        </Col>
      </Row>

      <div
        className="book-description"
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ color: "#333", fontSize: "20px", marginBottom: "10px" }}>
          Description
        </h2>
        <Text style={{ color: "#666" }}>{productData.description}</Text>
      </div>

      <div
        className="product-feedback"
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ color: "#333", fontSize: "20px", marginBottom: "10px" }}>
          Comments on the product
        </h2>
        <List
          itemLayout="horizontal"
          dataSource={feedbackData}
          renderItem={(feedback) => (
            <List.Item
              style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 0" }}
            >
              <List.Item.Meta
                avatar={<Avatar src={feedback.avatarUrl} />}
                title={
                  <Text strong style={{ color: "#333" }}>
                    {feedback.userName}
                  </Text>
                }
                description={
                  <>
                    <Rate disabled allowHalf value={feedback.score} />
                    <p style={{ color: "#666" }}>{feedback.comment}</p>
                    <Text type="secondary" style={{ color: "#999" }}>
                      {moment(feedback.createdDate).fromNow()}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </Content>
  );
};

export default ProductDetail;
