import React, { useState, useEffect } from "react";
import { Form, Input, Button, Rate, message, Card, Spin } from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "./Hooks/useAuth";

const { TextArea } = Input;

const CreateFeedback = () => {
  const { productId, orderItemId } = useParams(); // Extract from URL
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingFeedback, setFetchingFeedback] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/feedback/${orderItemId}`, // Adjust URL
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setFeedback(response.data);
        form.setFieldsValue({
          comment: response.data.comment,
          score: response.data.score,
        });
      } catch (error) {
        console.log("No existing feedback found", error);
      } finally {
        setFetchingFeedback(false);
      }
    };

    fetchFeedback();
  }, [orderItemId, auth, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (feedback) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/feedback/${feedback.id}`,
          {
            productId,
            orderItemId,
            comment: values.comment,
            score: values.score,
            userId: auth.id,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        message.success("Feedback updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/feedback`,
          {
            productId,
            comment: values.comment,
            score: values.score,
            userId: auth.id,
            orderItemId,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        message.success("Feedback submitted successfully!");
      }
      navigate(`/orders`);
    } catch (error) {
      console.error("Failed to submit feedback", error);
      message.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingFeedback) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Card title="Leave Feedback" bordered>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={
            feedback ? { comment: feedback.comment, score: feedback.score } : {}
          }
        >
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: "Please enter your comment" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="score"
            label="Rating"
            rules={[{ required: true, message: "Please rate the product" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {feedback ? "Update Feedback" : "Submit Feedback"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateFeedback;
