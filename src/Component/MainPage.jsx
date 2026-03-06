import React from "react";
import { Breadcrumb, Layout, Menu, theme, Divider } from "antd";
import Banner from "./Banner";
import ItemList from "./ItemList";
import HeaderBar from "./Header";
import ProductTypeList from "./ProductTypeList";

const { Content, Footer } = Layout;
const MainPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content
      style={{
        padding: "40px 100px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh"
      }}
    >
      <div style={{ marginBottom: "40px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <Banner />
      </div>
      
      <div
        style={{
          padding: "40px",
          flexGrow: 1,
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          borderRadius: "30px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#2c3e50", marginBottom: "10px" }}>Discover Excellence</h1>
          <p style={{ fontSize: "1.2rem", color: "#7f8c8d" }}>Curated selection of premium watches for the modern connoisseur</p>
        </div>
        
        <ProductTypeList />
        <Divider style={{ margin: "40px 0" }} />
        <ItemList />
      </div>
    </Content>
  );
};

export default MainPage;
