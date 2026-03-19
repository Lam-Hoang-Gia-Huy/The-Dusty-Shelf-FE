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
import { Upload, Image as AntImage } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";


const { Option } = Select;

const UpdateProduct = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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
        if (response.data.imageUrl) {
          setExistingImages(response.data.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
        message.error("Failed to load product details.");
      }
    };
    fetchProduct();
  }, [id, form]);

  const handleRemoveExistingImage = (urlToRemove) => {
    setExistingImages(existingImages.filter(url => url !== urlToRemove));
  };

  const onFinish = async (values) => {
    try {
      // 1. Update product details (including existing images list for sync/deletion)
      const updateData = { ...values, imageUrl: existingImages };
      await axiosInstance.put(`/api/v1/product/${id}`, updateData);

      // 2. Upload new images if any
      if (fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append("imageFiles", file.originFileObj);
        });
        await axiosInstance.post(`/api/v1/product/${id}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      message.success("Product updated successfully!");
      navigate(`/product-management`);
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
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please enter the author name" }]}
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

        <Form.Item label="Current Images">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {existingImages.map((url, index) => (
              <div key={index} style={{ position: "relative", display: "inline-block" }}>
                <AntImage src={url} width={100} style={{ borderRadius: "8px" }} />
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                  size="small"
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    zIndex: 10,
                  }}
                  onClick={() => handleRemoveExistingImage(url)}
                />
              </div>
            ))}
            {existingImages.length === 0 && <span style={{ color: "#999" }}>No images</span>}
          </div>
        </Form.Item>

        <Form.Item label="Add New Images">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false} // Prevent auto upload
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
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
