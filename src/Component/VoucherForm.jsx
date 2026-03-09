import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  message,
  Modal,
  Typography,
} from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const VoucherForm = () => {
  const { auth } = useAuth();
  const { Title, Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/voucher`,
        {
          ...values,
          status: false, // Set the status to false when created
          startDate: values.startDate.format("YYYY-MM-DD"),
          endDate: values.endDate.format("YYYY-MM-DD"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      message.success("Voucher created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating voucher:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(
          `Failed to create voucher: ${error.response.data.message}`
        );
      } else {
        message.error("Failed to create voucher.");
      }
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const showConfirmModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px 550px" }}>
      <Title level={3} className="formTitle">
        Voucher form
      </Title>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="code"
          label="Voucher Code"
          rules={[
            { required: true, message: "Please input the voucher code!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="discountValue"
          label="Discount Value"
          rules={[
            { required: true, message: "Please input the discount value!" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="minimumPurchase"
          label="Minimum Purchase"
          rules={[
            { required: true, message: "Please input the minimum purchase!" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="maxUsage"
          label="Maximum Usage"
          rules={[
            { required: true, message: "Please input the maximum usage!" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please input the start date!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: "Please input the end date!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={showConfirmModal}
            loading={loading}
            style={{ marginRight: 8 }}
          >
            Create Voucher
          </Button>
          <Button onClick={() => form.resetFields()} disabled={loading}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Confirm Voucher Creation"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading }}
      >
        <p>Are you sure you want to create this voucher?</p>
      </Modal>
    </div>
  );
};

export default VoucherForm;
