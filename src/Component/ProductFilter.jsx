import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Input,
  Select,
  Slider,
  Button,
  Card,
  Typography,
  Pagination,
  Empty,
  Spin,
  Space
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAuth from "./Hooks/useAuth";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const ProductFilter = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const { auth } = useAuth();

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: 0,
    maxPrice: 3000000,
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    handleSearch(1, pageSize);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = async (page = 1, size = 12, overrideFilters = null) => {
    setLoading(true);
    try {
      const { name, category, minPrice, maxPrice } = overrideFilters || filters;
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/search`, {
        params: {
          name,
          category: category === "All" || !category ? "" : category,
          minPrice,
          maxPrice,
          page: page - 1,
          size,
        },
      });
      setProducts(response.data.content);
      setTotalElements(response.data.totalElements);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (values) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }));
  };

  const getTimeSincePost = (postDate) => {
    return moment(postDate).fromNow();
  };

  return (
    <Content style={{ padding: "40px 100px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      <Row gutter={[32, 32]}>
        {/* Sidebar Filters */}
        <Col xs={24} md={7} lg={6}>
          <Card
            title={<Space><FilterOutlined /> Filters</Space>}
            style={{
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(31,38,135,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)"
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div>
                <Text strong>Search by Name</Text>
                <Input
                  placeholder="Watch name..."
                  prefix={<SearchOutlined />}
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  style={{ marginTop: "8px", borderRadius: "8px" }}
                />
              </div>

              <div>
                <Text strong>Category</Text>
                <Select
                  placeholder="Select Category"
                  style={{ width: "100%", marginTop: "8px" }}
                  allowClear
                  onChange={(val) => handleFilterChange("category", val)}
                  value={filters.category || undefined}
                >
                  <Option value="All">All Categories</Option>
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.name}>{cat.name}</Option>
                  ))}
                </Select>
              </div>

              <div>
                <Text strong>Price Range (đ)</Text>
                <Slider
                  range
                  min={0}
                  max={3000000}
                  step={50000}
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={handlePriceChange}
                  onAfterChange={(vals) => handleSearch(1, pageSize, { ...filters, minPrice: vals[0], maxPrice: vals[1] })}
                  tipFormatter={(val) => `${val?.toLocaleString() || 0} đ`}
                  style={{ marginTop: "24px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  <Text type="secondary">{filters.minPrice?.toLocaleString() || 0}đ</Text>
                  <Text type="secondary">{filters.maxPrice?.toLocaleString() || 0}đ</Text>
                </div>
              </div>

              <Button
                type="primary"
                icon={<SearchOutlined />}
                block
                onClick={() => handleSearch(1, pageSize)}
                style={{ height: "45px", borderRadius: "12px", background: "#2c3e50", border: "none" }}
              >
                Apply Filters
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Results */}
        <Col xs={24} md={17} lg={18}>
          <div style={{
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255,255,255,0.5)",
            padding: "15px 25px",
            borderRadius: "15px",
            backdropFilter: "blur(5px)"
          }}>
            <Title level={3} style={{ margin: 0, color: "#2c3e50" }}>Search Results</Title>
            <Text strong style={{ color: "#7f8c8d" }}>{totalElements} products found</Text>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px" }}><Spin size="large" /></div>
          ) : products.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {products.map((item) => (
                  <Col key={item.id} xs={24} sm={12} lg={8}>
                    <Card
                      hoverable
                      className="premium-product-card"
                      style={{ borderRadius: "20px", overflow: "hidden", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
                      onClick={() => navigate(`/product/${item.id}`)}
                      cover={
                        <div style={{ height: "220px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "15px" }}>
                          <img
                            alt={item.name}
                            src={item.imageUrl[0]}
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                            className="card-hover-image"
                          />
                        </div>
                      }
                    >
                      <Text type="secondary" style={{ fontSize: "12px", textTransform: "uppercase" }}>{item.category}</Text>
                      <Title level={5} style={{ margin: "4px 0 12px", height: "48px", overflow: "hidden" }}>{item.name}</Title>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text strong style={{ color: "#c0392b", fontSize: "1.1rem" }}>{item.price?.toLocaleString()} đ</Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>{getTimeSincePost(item.createdDate)}</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div style={{ textAlign: "center", marginTop: "60px", paddingBottom: "40px" }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalElements}
                  onChange={(page, size) => handleSearch(page, size)}
                  showSizeChanger
                  onShowSizeChange={(current, size) => setPageSize(size)}
                />
              </div>
            </>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.6)",
              padding: "80px",
              borderRadius: "30px",
              textAlign: "center",
              backdropFilter: "blur(10px)"
            }}>
              <Empty description={<Text style={{ fontSize: "1.2rem" }}>No products match your filters</Text>} />
              <Button style={{ marginTop: "20px" }} onClick={() => {
                const defaults = { name: "", category: "", minPrice: 0, maxPrice: 3000000 };
                setFilters(defaults);
                handleSearch(1, pageSize, defaults);
              }}>Reset Filters</Button>
            </div>
          )}
        </Col>
      </Row>
    </Content>
  );
};

export default ProductFilter;
