import React from "react";
import { Button, message } from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth";

const CheckoutButton = ({ totalPrice, voucherCode }) => {
  const { auth } = useAuth();
  const amount = totalPrice;
  const orderInfo = `Payment for order at My Shop`;

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/payment/create-payment-url`,
        {
          userId: auth.id,
          totalPrice,
          voucherCode,
          amount,
          orderInfo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        window.location.href = response.data.paymentUrl;
      } else {
        message.error("Checkout failed.");
      }
    } catch (error) {
      console.error("Error during checkout", error);
      message.error("Checkout failed.");
    }
  };

  return (
    <Button type="primary" onClick={handleCheckout}>
      Checkout
    </Button>
  );
};

export default CheckoutButton;
