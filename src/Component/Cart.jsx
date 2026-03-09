import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Row,
  Col,
  InputNumber,
  Select,
  message,
  Empty,
  Divider,
  Tag,
  Spin,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faTrash,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "./Hooks/useAuth";
import CheckoutButton from "./CheckOutButton";

const { Text, Title } = Typography;
const { Option } = Select;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const Cart = () => {
  const [cart, setCart] = useState({ cartItems: [], totalPrice: 0 });
  const [voucherCode, setVoucherCode] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [updatingItems, setUpdatingItems] = useState({});
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/cart/${auth.id}`,
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      if (response.status === 200) setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart data", error);
    }
  }, [auth.id, auth.accessToken]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchCart();
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/voucher/available`,
          { headers: { Authorization: `Bearer ${auth.accessToken}` } }
        );
        if (res.status === 200) setVouchers(res.data);
      } catch (e) {
        console.error("Error fetching vouchers", e);
      }
      setLoading(false);
    };
    init();
  }, [auth.id, auth.accessToken]);

  const handleRemoveFromCart = async (cartItemId) => {
    setUpdatingItems((prev) => ({ ...prev, [cartItemId]: true }));
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/cart/${auth.id}/${cartItemId}`,
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      await fetchCart();
    } catch (error) {
      message.error("Failed to remove item.");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleQuantityChange = async (item, newQuantity) => {
    if (!newQuantity || newQuantity < 1) return;
    const cartItemId = item.id;
    setUpdatingItems((prev) => ({ ...prev, [cartItemId]: true }));
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/cart/${auth.id}/item/${cartItemId}`,
        null,
        {
          params: { quantity: newQuantity },
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        }
      );
      if (response.status === 200) setCart(response.data);
    } catch (error) {
      message.error("Failed to update quantity.");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      message.warning("Please select a voucher.");
      return;
    }
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/cart/${auth.id}/apply-voucher`,
        null,
        {
          params: { voucherCode },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setCart(response.data);
        message.success("Voucher applied successfully!");
      }
    } catch (error) {
      message.error("Invalid voucher code.");
    }
  };

  // Calculate original total (before discount)
  const originalTotal = cart.cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const discountAmount = Math.max(0, originalTotal - cart.totalPrice);
  const hasDiscount = discountAmount > 0;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <FontAwesomeIcon icon={faCartShopping} style={{ marginRight: 10 }} />
        Your Shopping Cart
      </Title>

      {cart.cartItems.length > 0 ? (
        <Row gutter={[24, 24]}>
          {/* Cart Items */}
          <Col xs={24} lg={16}>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              {cart.cartItems.map((item, index) => (
                <div key={item.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px 20px",
                      gap: 16,
                      opacity: updatingItems[item.id] ? 0.5 : 1,
                      transition: "opacity 0.2s",
                    }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        flexShrink: 0,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.product.imageUrl?.[0] && (
                        <img
                          src={item.product.imageUrl[0]}
                          alt={item.product.name}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text strong style={{ fontSize: 15, display: "block" }}>
                        {item.product.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.product.category}
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        <Text style={{ color: "#c0392b", fontWeight: 600, fontSize: 15 }}>
                          {formatCurrency(item.product.price)}
                        </Text>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <InputNumber
                        min={1}
                        max={item.product.stockQuantity}
                        value={item.quantity}
                        disabled={updatingItems[item.id]}
                        onChange={(val) => handleQuantityChange(item, val)}
                        style={{ width: 70 }}
                        size="small"
                      />
                    </div>

                    {/* Item Total */}
                    <div style={{ textAlign: "right", minWidth: 90 }}>
                      <Text strong style={{ color: "#333", fontSize: 15 }}>
                        {formatCurrency(item.product.price * item.quantity)}
                      </Text>
                    </div>

                    {/* Remove Button */}
                    <Button
                      type="text"
                      danger
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      disabled={updatingItems[item.id]}
                      onClick={() => handleRemoveFromCart(item.id)}
                    />
                  </div>
                  {index < cart.cartItems.length - 1 && (
                    <Divider style={{ margin: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={8}>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                position: "sticky",
                top: 16,
              }}
            >
              <Title level={4} style={{ marginBottom: 16 }}>
                Order Summary
              </Title>

              {/* Voucher Selector */}
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  <FontAwesomeIcon icon={faTicket} style={{ marginRight: 6 }} />
                  Apply Voucher
                </Text>
                <Select
                  placeholder="Select a voucher"
                  style={{ width: "100%", marginBottom: 8 }}
                  onChange={setVoucherCode}
                  allowClear
                >
                  {vouchers.map((voucher) => (
                    <Option key={voucher.code} value={voucher.code}>
                      <div>
                        <Text strong>{voucher.code}</Text>
                        <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                          -{formatCurrency(voucher.discountValue)} | Min: {formatCurrency(voucher.minimumPurchase)} | Left: {voucher.maxUsage - voucher.currentUsage}
                        </Text>
                      </div>
                    </Option>
                  ))}
                </Select>
                <Button
                  type="default"
                  block
                  onClick={handleApplyVoucher}
                  style={{ borderRadius: 6 }}
                >
                  Apply
                </Button>
              </div>

              <Divider />

              {/* Price Breakdown */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text type="secondary">Subtotal</Text>
                  <Text>{formatCurrency(originalTotal)}</Text>
                </div>
                {hasDiscount && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text type="secondary">
                      Discount{" "}
                      <Tag color="green" style={{ fontSize: 10 }}>
                        {cart.voucherCode}
                      </Tag>
                    </Text>
                    <Text style={{ color: "#52c41a" }}>
                      -{formatCurrency(discountAmount)}
                    </Text>
                  </div>
                )}
                <Divider style={{ margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text strong style={{ fontSize: 16 }}>Total</Text>
                  <Text strong style={{ fontSize: 18, color: "#c0392b" }}>
                    {formatCurrency(cart.totalPrice)}
                  </Text>
                </div>
              </div>

              <CheckoutButton
                totalPrice={cart.totalPrice}
                voucherCode={voucherCode}
              />
            </div>
          </Col>
        </Row>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "60px 20px",
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Empty description="Your cart is empty" />
        </div>
      )}
    </div>
  );
};

export default Cart;
