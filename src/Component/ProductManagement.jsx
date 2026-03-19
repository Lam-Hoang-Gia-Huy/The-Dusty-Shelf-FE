import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./Hooks/useAuth";
import { Table, Button, Space, Tag, Popconfirm, message, Image, Input, Select, Card } from "antd";
import { Content } from "antd/es/layout/layout";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import axiosInstance from "./Config/axiosConfig";

const ProductManagement = () => {
    const { auth } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchText, selectedCategory, selectedStatus]);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get("/api/v1/product?size=1000");
            setProducts(response.data.content);
            setFilteredProducts(response.data.content);
        } catch (error) {
            console.error("Error fetching products:", error);
            message.error("Failed to load products.");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get("/api/v1/category");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        if (searchText) {
            filtered = filtered.filter(p =>
                (p.name && p.name.toLowerCase().includes(searchText.toLowerCase())) ||
                (p.author && p.author.toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (selectedStatus !== "All") {
            const statusBool = selectedStatus === "Active";
            filtered = filtered.filter(p => p.status === statusBool);
        }

        setFilteredProducts(filtered);
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            if (currentStatus) {
                await axiosInstance.delete(`/api/v1/product/${id}`); // Deactivate
                message.success("Product deactivated successfully");
            } else {
                // Activate - assuming there's an activate endpoint or we use PUT
                // Based on ProductService, deleteById sets status to false. 
                // We'll use PUT to set status back to true.
                const product = products.find(p => p.id === id);
                await axiosInstance.put(`/api/v1/product/${id}`, { ...product, status: true });
                message.success("Product activated successfully");
            }
            fetchProducts();
        } catch (error) {
            message.error("Failed to update product status");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (images) => (
                <Image
                    src={images && images.length > 0 ? images[0] : "https://via.placeholder.com/50"}
                    width={50}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Author",
            dataIndex: "author",
            key: "author",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price}`,
        },
        {
            title: "Stock",
            dataIndex: "stockQuantity",
            key: "stockQuantity",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status ? (
                    <Tag color="green">Active</Tag>
                ) : (
                    <Tag color="volcano">Inactive</Tag>
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (product) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => navigate(`/product/update/${product.id}`)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title={`Are you sure you want to ${product.status ? 'deactivate' : 'activate'} this product?`}
                        onConfirm={() => toggleStatus(product.id, product.status)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger={product.status} ghost size="small">
                            {product.status ? "Deactivate" : "Activate"}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ padding: "0 50px", marginTop: 24 }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h1>Product Management</h1>
                    <Button type="primary" onClick={() => navigate("/upload")}>
                        Add New Product
                    </Button>
                </div>

                <Card style={{ marginBottom: 16 }}>
                    <Space wrap>
                        <Input
                            placeholder="Search name or author"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Category"
                            value={selectedCategory}
                            onChange={value => setSelectedCategory(value)}
                            style={{ width: 150 }}
                        >
                            <Select.Option value="All">All Categories</Select.Option>
                            {categories.map(cat => (
                                <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Status"
                            value={selectedStatus}
                            onChange={value => setSelectedStatus(value)}
                            style={{ width: 120 }}
                        >
                            <Select.Option value="All">All Status</Select.Option>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                        <Button onClick={() => {
                            setSearchText("");
                            setSelectedCategory("All");
                            setSelectedStatus("All");
                        }}>
                            Reset
                        </Button>
                    </Space>
                </Card>

                <Table
                    dataSource={filteredProducts}
                    columns={columns}
                    rowKey={(record) => record.id}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </Content>
    );
};

export default ProductManagement;
