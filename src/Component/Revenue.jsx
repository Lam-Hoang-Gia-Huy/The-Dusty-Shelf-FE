import React, { useState } from "react";
import { Form, DatePicker, Button, Card, message } from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth"; // Adjust the import based on your auth implementation
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { RangePicker } = DatePicker;

const Revenue = () => {
  const { auth } = useAuth(); // Adjust this according to your auth implementation
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState([]);
  const [year, setYear] = useState(null);

  const fetchRevenueData = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`, // Adjust this according to your auth implementation
        },
      });
      setRevenueData(response.data);
    } catch (error) {
      message.error("Failed to fetch revenue data");
      console.error("Failed to fetch revenue data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearlyRevenue = () => {
    fetchRevenueData(`${process.env.REACT_APP_API_BASE_URL}/api/v1/revenue/yearly`);
  };

  const handleMonthlyRevenue = () => {
    if (year) {
      fetchRevenueData(`${process.env.REACT_APP_API_BASE_URL}/api/v1/revenue/monthly/${year}`);
    } else {
      message.error("Please select a year");
    }
  };

  const handleDateRangeRevenue = (dates) => {
    if (dates.length === 2) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      fetchRevenueData(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/revenue/range?startDate=${startDate}&endDate=${endDate}`
      );
    } else {
      message.error("Please select a valid date range");
    }
  };

  const formatRevenueData = (data) => {
    return Object.entries(data)
      .map(([key, value]) => ({
        period: key,
        revenue: value,
      }))
      .sort((a, b) => {
        // Sort logic for years and months
        if (a.period.includes("Year") && b.period.includes("Year")) {
          return a.period.localeCompare(b.period);
        } else if (a.period.includes("Month") && b.period.includes("Month")) {
          const monthA = parseInt(a.period.split(" ")[1]);
          const monthB = parseInt(b.period.split(" ")[1]);
          return monthA - monthB;
        } else {
          return 0;
        }
      });
  };

  const chartData = formatRevenueData(revenueData);

  return (
    <div style={{ padding: "20px" }}>
      <Card title="Revenue Dashboard" bordered>
        <Form layout="inline" style={{ marginBottom: "20px" }}>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleYearlyRevenue}
              loading={loading}
            >
              Yearly Revenue
            </Button>
          </Form.Item>
          <Form.Item>
            <DatePicker
              picker="year"
              onChange={(date) => setYear(date ? date.year() : null)}
              placeholder="Select Year"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleMonthlyRevenue}
              loading={loading}
            >
              Monthly Revenue
            </Button>
          </Form.Item>
          {/* <Form.Item>
            <RangePicker onChange={handleDateRangeRevenue} />
          </Form.Item> */}
        </Form>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Revenue;
