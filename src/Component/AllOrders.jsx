import React, { useEffect, useState } from "react";
import { Table, Button, message, Card, Typography, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAuth from "./Hooks/useAuth";

const { Title } = Typography;

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
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
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        message.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.id.toString().includes(searchText) ||
      (order.userName && order.userName.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredOrders(filtered);
  }, [orders, searchText]);

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={3} style={{ margin: 0 }}>
            Store Orders
          </Title>
          <Input
            placeholder="Search Order ID or Buyer"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Space>
    </Card>
  );
};

export default AllOrders;
