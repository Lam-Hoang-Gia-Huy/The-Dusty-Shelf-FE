import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import useAuth from "./Hooks/useAuth";
import { Button, Table, message } from "antd";

const VoucherComponent = () => {
  const [vouchers, setVouchers] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/voucher`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers", error);
    }
  };

  const deactivateVoucher = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/voucher/deactivate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      message.success("Voucher deactivated successfully");
      fetchVouchers(); // Refresh the list
    } catch (error) {
      console.error("Error deactivating voucher", error);
      message.error("Failed to deactivate voucher");
    }
  };

  const activateVoucher = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/voucher/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      message.success("Voucher activated successfully");
      fetchVouchers(); // Refresh the list
    } catch (error) {
      console.error("Error activating voucher", error);
      message.error("Failed to activate voucher");
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Discount Value",
      dataIndex: "discountValue",
      key: "discountValue",
    },
    {
      title: "Minimum Purchase",
      dataIndex: "minimumPurchase",
      key: "minimumPurchase",
    },
    {
      title: "Max Usage",
      dataIndex: "maxUsage",
      key: "maxUsage",
    },
    {
      title: "Current Usage",
      dataIndex: "currentUsage",
      key: "currentUsage",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Active" : "Inactive"),
    },
  ];

  if (auth.role === "ADMIN") {
    columns.push({
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="danger"
            onClick={() => deactivateVoucher(record.id)}
            disabled={!record.status}
            style={{ marginRight: 8 }}
          >
            Deactivate
          </Button>
          <Button
            type="primary"
            onClick={() => activateVoucher(record.id)}
            disabled={record.status}
          >
            Activate
          </Button>
        </>
      ),
    });
  }

  return <Table dataSource={vouchers} columns={columns} rowKey="id" />;
};

export default VoucherComponent;
