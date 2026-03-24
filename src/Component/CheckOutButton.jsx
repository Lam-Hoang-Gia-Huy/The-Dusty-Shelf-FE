import React from "react";
import { Button, message } from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth";

const CheckoutButton = ({ totalPrice, voucherCode, disabled }) => {
  const { auth } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const amount = totalPrice;
  const orderInfo = `Payment for order at My Shop`;

  const handleCheckout = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleCheckout}
      block
      size="large"
      disabled={disabled || loading}
      loading={loading}
      style={{ borderRadius: 8, height: 50, fontSize: 16, fontWeight: 600 }}
    >
      Checkout
    </Button>
  );
};

export default CheckoutButton;
