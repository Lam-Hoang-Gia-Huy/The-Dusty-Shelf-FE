import React from "react";
import { Layout } from "antd";
const Footer = () => {
  return (
    <Layout.Footer style={{ textAlign: "center", color: "#666", padding: '24px' }}>
      Dustshelf - Preserving the value of time © {new Date().getFullYear()}
    </Layout.Footer>
  );
};

export default Footer;
