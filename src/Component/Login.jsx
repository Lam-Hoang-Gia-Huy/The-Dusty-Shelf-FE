import React, { useRef, useState, useEffect } from "react";
import {
  Layout,
  Button,
  Form,
  Input,
  Typography,
  message,
  Card,
  Space,
  Divider
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "./Hooks/useAuth";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;
const LOGIN_URL = `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/authenticate`;

const LoginPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const userRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(LOGIN_URL, values);
      const { user, token, refreshToken } = response.data;

      setAuth({
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdDate: user.createdDate,
        accessToken: token,
        refreshToken: refreshToken,
      });

      message.success("Logged in successfully!");
      if (user.role === "APPRAISER") {
        navigate("/unappraised-watches");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        message.error("No Server Response");
      } else if (err.response?.status === 400) {
        message.error("Incorrect Email or Password");
      } else if (err.response?.status === 401) {
        message.error("Unauthorized");
      } else {
        message.error("Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            overflow: "hidden"
          }}
          bodyStyle={{ padding: "40px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <LoginOutlined style={{ fontSize: "40px", color: "#fff" }} />
            </div>
            <Title level={2} style={{ color: "#fff", margin: 0, fontWeight: "800" }}>Welcome Back</Title>
            <Text style={{ color: "rgba(255,255,255,0.6)" }}>Enter your credentials to access your account</Text>
          </div>

          <Form
            name="login_form"
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(255,255,255,0.7)" }} />}
                placeholder="Email Address"
                ref={userRef}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: "12px"
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
              style={{ marginBottom: "12px" }}
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

            <div style={{ textAlign: "right", marginBottom: "24px" }}>
              <Link style={{ color: "#74b9ff", fontSize: "14px" }} to="#">Forgot password?</Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: "50px",
                  borderRadius: "12px",
                  background: "#fff",
                  color: "#2c3e50",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "16px"
                }}
              >
                Sign In
              </Button>
            </Form.Item>

            <Divider style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>OR</Divider>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Text style={{ color: "rgba(255,255,255,0.6)" }}>New here? </Text>
              <Link to="/register" style={{ color: "#fff", fontWeight: "600" }}>Create an account</Link>
            </div>
          </Form>

          <div style={{ position: "absolute", bottom: "40px", left: "0", right: "0", textAlign: "center" }}>
          </div>
        </Card>

        {/* Home link */}
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

export default LoginPage;
