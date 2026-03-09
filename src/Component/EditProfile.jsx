import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Form, Input, Button, message } from "antd";
import useAuth from "./Hooks/useAuth";
import ImageUpload from "./ImageUpload";

const { Content } = Layout;

const EditProfile = () => {
  const { auth, setAuth } = useAuth();
  const [form] = Form.useForm();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/${auth.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setInitialValues(data);
          form.setFieldsValue(data);
        } else {
          message.error("Failed to fetch user data");
        }
      } catch (error) {
        message.error("Error fetching user data: " + error.message);
      }
    };

    fetchUserData();
  }, [auth, form]);

  const handleFilesSelected = (fileList) => {
    setSelectedFiles(fileList.map((file) => file.originFileObj));
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    const updatedValues = { ...initialValues, ...values }; // Merge old and new values

    formData.append(
      "user",
      new Blob([JSON.stringify(updatedValues)], { type: "application/json" })
    );
    if (selectedFiles.length > 0) {
      formData.append("avatar", selectedFiles[0]);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/${auth.id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        message.success("Profile updated successfully!");
        setAuth({ ...auth, avatarUrl: updatedUser.avatarUrl });
      } else if (response.status === 403) {
        message.error("You do not have permission to update this profile.");
      } else {
        message.error("Profile update failed!");
      }
    } catch (error) {
      message.error("Error updating profile: " + error.message);
    }
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <Content style={{ padding: "30px 300px 200px", flexGrow: 1 }}>
      <div style={{ padding: 24, background: "#f0f2f5", borderRadius: 16 }}>
        <Row justify="center">
          <Col span={12}>
            <ImageUpload onFilesSelected={handleFilesSelected} imgNum={1} />
          </Col>
          <Col span={12}>
            <h1>Edit Profile</h1>
            <Form
              form={form}
              name="editProfile"
              initialValues={initialValues}
              onFinish={onFinish}
            >
              <Form.Item
                label="Username"
                name="name"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default EditProfile;
