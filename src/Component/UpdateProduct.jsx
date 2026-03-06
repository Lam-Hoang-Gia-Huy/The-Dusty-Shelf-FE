import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Checkbox,
  Select,
  message,
} from "antd";
import axiosInstance from "./Config/axiosConfig";


const { Option } = Select;

const UpdateProduct = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
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

  useEffect(() => {
    // Fetch product details and set form values
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/product/${id}`
        );
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error("Error fetching product details: ", error);
        message.error("Failed to load product details.");
      }
    };
    fetchProduct();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      await axiosInstance.put(`/api/v1/product/${id}`, values);
      message.success("Product updated successfully!");
      navigate(`/product/${id}`);
    } catch (error) {
      console.error("Error updating product: ", error);
      message.error("Failed to update product.");
    }
  };

  return (
    <div
      style={{
        margin: "20px 400px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Update Product
      </h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[
            { required: true, message: "Please select the product category" },
          ]}
        >
          <Select>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter the product description" },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[
            { required: true, message: "Please enter the product price" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="stockQuantity"
          label="Stock Quantity"
          rules={[
            { required: true, message: "Please enter the stock quantity" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="status" label="Status" valuePropName="checked">
          <Checkbox>Available</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateProduct;
