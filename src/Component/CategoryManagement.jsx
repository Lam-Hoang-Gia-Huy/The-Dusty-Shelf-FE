import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "./Config/axiosConfig";

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/v1/category");
            setCategories(response.data);
        } catch (error) {
            message.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const showModal = (category = null) => {
        setEditingCategory(category);
        if (category) {
            form.setFieldsValue(category);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
    };

    const onFinish = async (values) => {
        try {
            if (editingCategory) {
                await axiosInstance.put(`/api/v1/category/${editingCategory.id}`, values);
                message.success("Category updated successfully");
            } else {
                await axiosInstance.post("/api/v1/category", values);
                message.success("Category created successfully");
            }
            fetchCategories();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/v1/category/${id}`);
            message.success("Category deleted successfully");
            fetchCategories();
        } catch (error) {
            message.error("Failed to delete category");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete the category?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Category Management</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Category
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
            />
            <Modal
                title={editingCategory ? "Edit Category" : "Add Category"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: "Please enter category name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingCategory ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;
