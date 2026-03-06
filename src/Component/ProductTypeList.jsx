import React from "react";
import { Row, Col, Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "./Config/axiosConfig";

const ProductTypeList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
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

  const handleTypeClick = (category) => {
    navigate(`/filter?category=${category.name}`);
  };

  const displayCategories = categories.slice(0, 5);

  return (
    <Row gutter={[20, 20]} justify="center" style={{ marginBottom: "40px" }}>
      {displayCategories.map((category) => (
        <Col key={category.id} xs={12} sm={8} md={4}>
          <Card
            hoverable
            onClick={() => handleTypeClick(category)}
            className="premium-category-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(5px)",
              textAlign: "center",
              height: "120px",
              borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              transition: "all 0.3s ease"
            }}
          >
            <FontAwesomeIcon
              icon={faTag}
              size="2x"
              style={{ marginBottom: "12px", color: "#c0392b" }}
            />
            <span style={{ fontWeight: "600", color: "#2c3e50" }}>{category.name}</span>
          </Card>
        </Col>
      ))}
      {categories.length > 5 && (
        <Col xs={12} sm={8} md={4}>
          <Card
            hoverable
            onClick={() => navigate("/filter")}
            className="premium-category-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#2c3e50",
              textAlign: "center",
              height: "120px",
              borderRadius: "20px",
              border: "none",
              boxShadow: "0 4px 20px rgba(44, 62, 80, 0.2)",
              transition: "all 0.3s ease"
            }}
          >
            <span style={{ fontWeight: "700", color: "#fff", fontSize: "1.1rem" }}>VIEW ALL</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", marginTop: "4px" }}>+{categories.length - 5} More</span>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default ProductTypeList;
