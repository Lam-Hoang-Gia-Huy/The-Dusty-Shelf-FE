import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel, message, List, Avatar, Rate, Select, InputNumber } from "antd";
import axios from "axios";
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/${id}`
        );
        setProductData(productResponse.data);

        const feedbackResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/feedback/product/${id}`
        );
        setFeedbackData(feedbackResponse.data);

        const staffResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/staff`
        );
        setStaffList(staffResponse.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        padding: "20px 400px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Col span={12}>
          <Carousel arrows>
            {productData.imageUrl?.map((imageUrl) => (
              <div key={imageUrl}>
                <PhotoProvider>
                  <PhotoView src={imageUrl}>
                    <img
                      src={imageUrl}
                      alt={productData.name}
                      className="contentStyle"
                      style={{ borderRadius: "8px" }}
                    />
                  </PhotoView>
                </PhotoProvider>
              </div>
            ))}
          </Carousel>
        </Col>
        <Col style={{ marginLeft: "20px", color: "#333" }} span={11}>
          <h1 style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}>
            {productData.name}
          </h1>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px", color: "#666" }}>
              Price:{" "}
            </Text>
            <Text style={{ fontSize: "16px", color: "#ff4d4f" }}>
              {productData.price?.toLocaleString()} đ
            </Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px", color: "#666" }}>
              Category:{" "}
            </Text>
            <Text style={{ fontSize: "16px", color: "#333" }}>
              {productData.category}
            </Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px", color: "#666" }}>
              Quantity:{" "}
            </Text>
            <Text style={{ fontSize: "16px", color: "#333" }}>
              {productData.stockQuantity}
            </Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px", color: "#666" }}>
              Posted since:{" "}
            </Text>
            <Text style={{ fontSize: "16px", color: "#333" }}>
              {moment(productData.createdDate).fromNow()}
            </Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px", color: "#666" }}>
              Rating:{" "}
            </Text>
            <Rate disabled allowHalf value={productData.averageScore} />
          </div>

          {auth && auth.role !== "ADMIN" && auth.role !== "STAFF" && (
            <>
              <Select
                placeholder="Select a staff member"
                onChange={(value) => setSelectedStaffId(value)}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                {staffList.map((staff) => (
                  <Option key={staff.id} value={staff.id}>
                    {staff.name}
                  </Option>
                ))}
              </Select>
              <ChatStartButton
                productId={productData.id}
                userId={auth.id}
                staffId={selectedStaffId}
              />
            </>
          )}
          {auth && auth.role == "ADMIN" && (
            <Button
              type="primary"
              onClick={() => navigate(`/product/update/${productData.id}`)}
            >
              Update this product
            </Button>
          )}

          {showAddToCartButton &&
            auth &&
            auth.role !== "ADMIN" &&
            auth.role !== "STAFF" && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <Text strong style={{ fontSize: "16px", color: "#666" }}>Quantity:</Text>
                  <InputNumber
                    min={1}
                    max={productData.stockQuantity}
                    value={quantity}
                    onChange={(val) => setQuantity(val || 1)}
                    style={{ width: "80px" }}
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>({productData.stockQuantity} in stock)</Text>
                </div>
                <Button
                  type="primary"
                  style={{
                    background: "#ff4d4f",
                    borderColor: "#ff4d4f",
                  }}
                  onClick={addToCart}
                >
                  Add to Cart <FontAwesomeIcon size="lg" icon={faCartShopping} />
                </Button>
              </div>
            )}
        </Col>
      </Row>

      <div
        className="watch-description"
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
