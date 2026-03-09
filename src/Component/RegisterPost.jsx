import React, { useState, useEffect } from "react";
import axiosInstance from "./Config/axiosConfig";
import {
  Layout,
  theme,
  Typography,
  Col,
  Button,
  message,
  Row,
  Form,
  Input,
  Select,
  InputNumber,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import ImageUpload from "./ImageUpload";
import useAuth from "./Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;

const RegisterPost = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form] = Form.useForm();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilesSelected = (fileList) => {
    setSelectedFiles(fileList.map((file) => file.originFileObj));
  };

  const handleUpload = async (productId) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/${productId}/images`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      if (response.ok) {
        message.success("Upload successful!");
        setSelectedFiles([]); // Clear selected files
      } else {
        message.error("Upload failed.");
      }
      navigate("/");
    } catch (error) {
      message.error("Upload error: " + error);
    }
  };

  const onFinish = async (values) => {
    try {
      // Include user ID in the request body
      const body = { ...values, userId: auth.id };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`, // Include authentication token in request headers
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const data = await response.json();
        message.success("Product details submitted successfully!");
        if (selectedFiles.length > 0) {
          await handleUpload(data.id);
        }
      } else {
        message.error("Failed to submit product details.");
      }
    } catch (error) {
      message.error("Submission error: " + error);
    }
  };



  return (
    <Content
      style={{
        padding: "30px 300px 0 300px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 24,
          flexGrow: 1,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Title mark className="formTitle" color="#c57071" level={2}>
          UPLOAD PRODUCT FORM <FontAwesomeIcon size="lg" icon={faUpload} />
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Title className="formTitle" type="success" level={2}>
              Upload Image here
            </Title>
            <ImageUpload onFilesSelected={handleFilesSelected} imgNum={8} />
          </Col>
          <Col style={{ borderLeft: "solid 1px" }} span={16}>
            <Title className="formTitle" type="success" level={2}>
              Product's information
            </Title>
            <Form
              form={form}
              name="register_post_form"
              onFinish={onFinish}
              style={{ marginTop: 16 }}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the name",
                  },
                ]}
              >
                <Input placeholder="Enter name here" />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please select a category",
                  },
                ]}
              >
                <Select placeholder="Choose category here">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please input the price!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="stockQuantity"
                rules={[
                  { required: true, message: "Please input the number!" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter the description",
                  },
                ]}
              >
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: 16 }}
                >
                  Submit Product Details
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default RegisterPost;
