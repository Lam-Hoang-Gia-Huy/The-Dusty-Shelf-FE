import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "./Rating";
import {
  Spin,
  Avatar,
  List,
  Card,
  Divider,
  Typography,
  Row,
  Col,
  Space,
  Collapse,
} from "antd";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(
          `http://localhost:8080/api/v1/user/${id}`
        );
        setUserData(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ padding: "10px" }}>
      <Title className="formTitle" level={2}>
        User Detail
      </Title>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card
            bordered={false}
            style={{
              textAlign: "center",
              background: "#f0f2f5",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Avatar size={120} src={userData.avatarUrl} alt="Avatar" />
            <Title level={3} style={{ marginTop: "20px", marginBottom: "0" }}>
              {userData.name}
            </Title>
            <Space
              direction="vertical"
              size="small"
              style={{ textAlign: "left", width: "100%", marginTop: "20px" }}
            >
              <Text>
                <b>Name:</b> {userData.name}
              </Text>

              <Text>
                <b>Member since:</b> {formatDate(userData.createdDate)}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col
          xs={24}
          sm={16}
          md={18}
          style={{
            background: "rgb(213 216 230)",
            borderRadius: "10px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Title level={3}>Welcome to Watch Hub Profile</Title>
          <Text style={{ fontSize: "16px" }}>
            This is the official profile page for {userData.name}. 
            As a valued member of our community, you can manage your orders and profile settings from your personal dashboard.
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default UserDetail;
