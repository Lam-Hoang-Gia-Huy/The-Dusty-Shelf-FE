import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./Hooks/useAuth";
import { Table, Button, Space, Tag, Popconfirm, message, Modal, Form, Input } from "antd";
import { Content } from "antd/es/layout/layout";
import { SearchOutlined } from "@ant-design/icons";

const UserManagement = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      (user.name && user.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchText]);

  const fetchUsers = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
    // Filter out ADMIN users to prevent accidental management and fulfill user request
    const regularUsers = response.data.filter(user => user.role !== "ADMIN");
    setUsers(regularUsers);
    setFilteredUsers(regularUsers);
  };

  const handleCreateStaff = async (values) => {
    try {
      const payload = {
        userName: values.userName,
        email: values.email,
        password: values.password,
        avatarUrl: "https://res.cloudinary.com/dfeuv0ynf/image/upload/v1718868313/ytqqm8d9pavipqjjyfwi.jpg",
      };
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/register-staff`, payload, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      message.success("Staff created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error("Failed to create staff: " + (error.response?.data?.message || error.message));
    }
  };

  const deactivateUser = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/deactivate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      fetchUsers(); // Refresh user data after deactivation
      message.success("User deactivated successfully");
    } catch (error) {
      message.error("Failed to deactivate user");
    }
  };

  const activateUser = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/activate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      fetchUsers(); // Refresh user data after activation
      message.success("User activated successfully");
    } catch (error) {
      message.error("Failed to activate user");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "ADMIN" ? "volcano" : role === "STAFF" ? "blue" : "green"}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="orange">Inactive</Tag>
        ), // Use Ant Design tags for visual distinction
    },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/user/${user.id}`)}
          >
            Detail
          </Button>
          {user.status ? (
            <Popconfirm
              title="Are you sure you want to deactivate this user?"
              onConfirm={() => deactivateUser(user.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger ghost size="small">
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to activate this user?"
              onConfirm={() => activateUser(user.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" ghost size="small">
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Content
      style={{
        padding: "0 200px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1>User Management</h1>
          <Space>
            <Input
              placeholder="Search name or email"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Create Staff
            </Button>
          </Space>
        </div>
        <Table
          dataSource={filteredUsers}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record.id}
        />
      </div>

      <Modal
        title="Create Staff Account"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateStaff}
          initialValues={{
            userName: "",
            email: "",
            password: "",
          }}
        >
          <Form.Item
            name="userName"
            label="Name"
            rules={[{ required: true, message: "Please enter staff name" }]}
          >
            <Input placeholder="Staff Name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input placeholder="Staff Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Staff
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default UserManagement;
