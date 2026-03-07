import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  message,
  Popconfirm,
  Tag,
  Typography,
} from "antd";
import {
  PlusOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import axiosInstance from "./Config/axiosConfig";

import moment from "moment";

const { Title, Text } = Typography;

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/voucher");
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers", error);
      message.error("Failed to fetch vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axiosInstance.post(
        "/api/v1/voucher",
        {
          ...values,
          status: false,
          startDate: values.startDate.format("YYYY-MM-DD"),
          endDate: values.endDate.format("YYYY-MM-DD"),
        }
      );
      message.success("Voucher created successfully!");
      fetchVouchers();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating voucher:", error);
      message.error("Failed to create voucher");
    } finally {
      setLoading(false);
    }
  };

  const toggleVoucherStatus = async (id, currentStatus) => {
    const endpoint = currentStatus ? "deactivate" : "approve";
    try {
      await axiosInstance.put(
        `/api/v1/voucher/${endpoint}/${id}`,
        {}
      );
      message.success(`Voucher ${currentStatus ? "deactivated" : "activated"} successfully`);
      fetchVouchers();
    } catch (error) {
      console.error(`Error changing voucher status`, error);
      message.error("Failed to change status");
    }
  };

  const columns = [
    {
      title: "Voucher Code",
      dataIndex: "code",
      key: "code",
      render: (text) => <Text strong style={{ color: "#c0392b" }}>{text}</Text>,
    },
    {
      title: "Discount",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (val) => <Text strong>{val.toLocaleString()} đ</Text>,
    },
    {
      title: "Min Purchase",
      dataIndex: "minimumPurchase",
      key: "minimumPurchase",
      render: (val) => <span>{val.toLocaleString()} đ</span>,
    },
    {
      title: "Usage",
      key: "usage",
      render: (_, record) => (
        <span>{record.currentUsage} / {record.maxUsage}</span>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          <div>Start: {moment(record.startDate).format("DD/MM/YYYY")}</div>
          <div>End: {moment(record.endDate).format("DD/MM/YYYY")}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status ? (
            <Popconfirm
              title="Deactivate this voucher?"
              onConfirm={() => toggleVoucherStatus(record.id, true)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<StopOutlined />} danger size="small">
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Activate this voucher?"
              onConfirm={() => toggleVoucherStatus(record.id, false)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<CheckCircleOutlined />} type="primary" size="small">
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "40px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ 
          marginBottom: "30px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          background: "#fff",
          padding: "20px 30px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}>
        <Title level={2} style={{ margin: 0 }}>Voucher Management</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showModal}
          style={{ height: "40px", borderRadius: "10px", background: "#2c3e50" }}
        >
          Create New Voucher
        </Button>
      </div>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table
          columns={columns}
          dataSource={vouchers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="Create New Voucher"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        style={{ borderRadius: "20px" }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <Form.Item
              name="code"
              label="Voucher Code"
              rules={[{ required: true, message: "Please input the voucher code!" }]}
            >
              <Input placeholder="e.g. SUMMER2024" />
            </Form.Item>
            <Form.Item
              name="discountValue"
              label="Discount Value (đ)"
              rules={[{ required: true, message: "Please input the discount value!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="minimumPurchase"
              label="Minimum Purchase (đ)"
              rules={[{ required: true, message: "Please input the minimum purchase!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="maxUsage"
              label="Maximum Usage Limit"
              rules={[{ required: true, message: "Please input the maximum usage!" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "Please select end date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
          
          <Form.Item style={{ marginBottom: 0, marginTop: "20px", textAlign: "right" }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} style={{ background: "#2c3e50" }}>
                Create Voucher
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;
