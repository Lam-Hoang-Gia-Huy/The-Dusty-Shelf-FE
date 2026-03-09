import React, { useEffect, useState } from "react";
import { Table, Button, message, Card, Typography, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAuth from "./Hooks/useAuth";

const { Title } = Typography;

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  const navigate = useNavigate();
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/orders`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        message.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Buyer",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `${formatCurrency(amount)}`,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/store-orders-items/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Card style={{ margin: "20px" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={3} className="formTitle">
          Store Orders
        </Title>
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Space>
    </Card>
  );
};

export default AllOrders;
