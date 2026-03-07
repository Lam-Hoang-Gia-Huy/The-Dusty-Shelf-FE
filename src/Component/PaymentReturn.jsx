import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import { message } from "antd";
import useAuth from "./Hooks/useAuth";

const PaymentReturn = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const paymentProcessed = useRef(false);

  useEffect(() => {
    if (paymentProcessed.current) return;
    paymentProcessed.current = true; // Claim the lock immediately — prevents StrictMode double-invocation

    const handlePaymentReturn = async () => {
      const query = queryString.parse(location.search);
      const secureHash = query["vnp_SecureHash"];
      delete query["vnp_SecureHash"];

      try {
        // Step 1: Verify payment with Backend
        // Backend will ALSO: update stock, increment voucher usage, and CREATE the Order
        const verifyResponse = await axios.post(
          `http://localhost:8080/api/v1/payment/verify-payment/${auth.id}`,
          { ...query, vnp_SecureHash: secureHash },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );

        console.log("Verification response: ", verifyResponse.data);

        if (verifyResponse.data.success) {
          message.success("Payment was successful!");

          // Step 2: Clear the cart (order already created by Backend)
          await axios.post(
            `http://localhost:8080/api/v1/cart/clear/${auth.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          );

          navigate("/");
        } else {
          message.error("Payment failed: " + (verifyResponse.data.message || "Unknown error"));
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying payment: ", error);
        message.error("An error occurred while verifying the payment.");
        navigate("/");
      }
    };

    handlePaymentReturn();
  }, []);

  return <div>Processing payment...</div>;
};

export default PaymentReturn;
