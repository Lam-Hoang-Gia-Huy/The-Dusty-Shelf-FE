import React, { useState } from "react";
import { Layout, Row, Col, Form, Input, Button, message, Typography, Card, Space, Divider } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  ArrowLeftOutlined, 
  UserAddOutlined 
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const payload = {
      userName: values.userName,
      email: values.email,
      password: values.password,
      avatarUrl: "https://res.cloudinary.com/dfeuv0ynf/image/upload/v1718868313/ytqqm8d9pavipqjjyfwi.jpg",
    };

    try {
      await axios.post(`http://localhost:8080/api/v1/auth/register`, payload);
      message.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      message.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: "550px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            overflow: "hidden"
          }}
          bodyStyle={{ padding: "40px 50px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "35px" }}>
            <div style={{ 
                width: "70px", 
                height: "70px", 
                background: "rgba(255,255,255,0.1)", 
                borderRadius: "20px", 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center",
                marginBottom: "20px",
                border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <UserAddOutlined style={{ fontSize: "35px", color: "#fff" }} />
            </div>
            <Title level={2} style={{ color: "#fff", margin: 0, fontWeight: "800", fontSize: "2rem" }}>Create Account</Title>
            <Text style={{ color: "rgba(255,255,255,0.6)" }}>Join our community of watch collectors</Text>
          </div>

          <Form name="register" layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="userName"
              rules={[{ required: true, message: "Please input your username!" }]}
              style={{ marginBottom: "16px" }}
            >
              <Input 
                prefix={<UserOutlined style={{ color: "rgba(255,255,255,0.7)" }} />} 
                placeholder="Username" 
                style={{ 
                    background: "rgba(255,255,255,0.05)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    color: "#fff",
                    borderRadius: "12px"
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { type: "email", message: "Invalid email format!" },
                { required: true, message: "Please input your email!" },
              ]}
              style={{ marginBottom: "16px" }}
            >
              <Input 
                prefix={<MailOutlined style={{ color: "rgba(255,255,255,0.7)" }} />} 
                placeholder="Email Address" 
                style={{ 
                    background: "rgba(255,255,255,0.05)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    color: "#fff",
                    borderRadius: "12px"
                }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Password required!" }]}
                  style={{ marginBottom: "24px" }}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "rgba(255,255,255,0.7)" }} />}
                    placeholder="Password"
                    style={{ 
                        background: "rgba(255,255,255,0.05)", 
                        border: "1px solid rgba(255,255,255,0.1)", 
                        color: "#fff",
                        borderRadius: "12px"
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Confirm your password!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Passwords mismatch!"));
                      },
                    }),
                  ]}
                  style={{ marginBottom: "24px" }}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "rgba(255,255,255,0.7)" }} />}
                    placeholder="Confirm"
                    style={{ 
                        background: "rgba(255,255,255,0.05)", 
                        border: "1px solid rgba(255,255,255,0.1)", 
                        color: "#fff",
                        borderRadius: "12px"
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}
                style={{ 
                    height: "55px", 
                    borderRadius: "15px", 
                    background: "#fff", 
                    color: "#2c3e50", 
                    border: "none",
                    fontWeight: "800",
                    fontSize: "17px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                }}
              >
                Create Account
              </Button>
            </Form.Item>

            <Divider style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>OR</Divider>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Text style={{ color: "rgba(255,255,255,0.6)" }}>Existing user? </Text>
              <Link to="/login" style={{ color: "#fff", fontWeight: "600" }}>Log in here</Link>
            </div>
          </Form>
        </Card>

        <div style={{ position: "fixed", top: "40px", left: "40px" }}>
            <Button 
                type="text" 
                onClick={() => navigate("/")} 
                icon={<ArrowLeftOutlined />} 
                style={{ color: "#fff", display: "flex", alignItems: "center" }}
            >
                Back to Home
            </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default Register;
