import React, { useEffect, useState } from "react";
import {
  Descriptions,
  List,
  message,
  Card,
  Spin,
  Typography,
  Tag,
  Row,
  Col,
  Button,
} from "antd";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import useAuth from "./Hooks/useAuth";
import moment from "moment";

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState({});
  const { auth } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        const orderData = response.data;
        setOrder(orderData);
        await fetchFeedbacks(orderData.orderItems);
      } catch (error) {
        console.error("Failed to fetch order", error);
        message.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbacks = async (orderItems) => {
      const feedbackData = {};
      for (const item of orderItems) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/feedback/${item.id}`, // Adjust URL
            {
              headers: {
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          );
          feedbackData[item.id] = response.data;
        } catch (error) {
          feedbackData[item.id] = null;
        }
      }
      setFeedbacks(feedbackData);
    };

    fetchOrder();
  }, [orderId, auth]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading || !order) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={
          <Title level={3} style={{ color: "#1890ff" }}>
            Order Details
          </Title>
        }
        bordered
        style={{ marginBottom: "20px" }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Order ID">
            <Tag color="blue">{order.id}</Tag>
          </Descriptions.Item>
          {order.voucherCode && (
            <Descriptions.Item label="Original Amount">
              <Text delete>{formatCurrency(order.originalAmount)}</Text>
            </Descriptions.Item>
          )}
          {order.voucherCode && (
            <Descriptions.Item label="Voucher Applied">
              <Tag color="green">{order.voucherCode}</Tag>
              <Text type="danger"> -{formatCurrency(order.discountAmount)}</Text>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Total Amount">
            <Text strong style={{ fontSize: "18px", color: "#f5222d" }}>
              {formatCurrency(order.totalAmount)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Created Date">
            <Text>
              {moment(order.createdDate).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={<Title level={4}>Order Items</Title>} bordered>
        <List
          bordered
          dataSource={order.orderItems}
          renderItem={(item) => (
            <List.Item style={{ padding: "20px" }}>
              <Row gutter={[16, 16]} style={{ width: "100%" }}>
                <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                  {item.product.imageUrl &&
                    item.product.imageUrl.length > 0 && (
                      <img
                        src={item.product.imageUrl[0]}
                        alt={item.product.name}
                        style={{ width: "100%", borderRadius: "8px" }}
                      />
                    )}
                </Col>
                <Col xs={24} sm={24} md={18} lg={20} xl={20}>
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Name">
                      <Link to={`/product/${item.product.id}`}>
                        <Text strong>{item.product.name}</Text>
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">
                      {item.product.category}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                      {item.product.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                      {formatCurrency(item.product.price)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Quantity">
                      {item.quantity}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total">
                      {formatCurrency(item.product.price * item.quantity)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Actions">
                      <Link to={`/feedback/${item.product.id}/${item.id}`}>
                        <Button type="primary">
                          {feedbacks[item.id]
                            ? "Edit Feedback"
                            : "Leave Feedback"}
                        </Button>
                      </Link>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default OrderDetail;
