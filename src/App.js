import React from "react";
import "./App.css";
import MainPage from "./Component/MainPage";
import RequireAuth from "./Component/RequireAuth";
import { Routes, Route } from "react-router-dom";
import ProductDetail from "./Component/Productdetail";
import ProductFilter from "./Component/ProductFilter";
import Register from "./Component/Register";
import RegisterPost from "./Component/RegisterPost";
import LoginPage from "./Component/Login";
import Profile from "./Component/Profile";
import EditProfile from "./Component/EditProfile";
import LayoutCom from "./Component/Layout";
import Cart from "./Component/Cart";
import MyPost from "./Component/MyPost";
import UserDetail from "./Component/UserProfile";
import PaymentReturn from "./Component/PaymentReturn";
import MyOrders from "./Component/MyOrders";
import OrderDetail from "./Component/OrderDetail";
import Chat from "./Component/Chat";
import UserManagement from "./Component/UserManagement";
import CreateFeedback from "./Component/FeedbackPage";
import Revenue from "./Component/Revenue";
import VoucherManagement from "./Component/VoucherManagement";
import UpdateProduct from "./Component/UpdateProduct";
import AllOrders from "./Component/AllOrders";
import OrderDetailForStaff from "./Component/OrderDetailForStaff";
import CategoryManagement from "./Component/CategoryManagement";
import ProductManagement from "./Component/ProductManagement";
import useAuth from "./Component/Hooks/useAuth";
import { Navigate } from "react-router-dom";
const HomeRedirect = () => {
  const { auth } = useAuth();
  if (auth && (auth.role === "ADMIN" || auth.role === "STAFF")) {
    return <Navigate to="/product-management" replace />;
  }
  return <MainPage />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/filter" element={<ProductFilter />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth role={["USER"]}></RequireAuth>}>
          <Route path="/upload" element={<RegisterPost />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/My-Post" element={<MyPost />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route
            path="/feedback/:productId/:orderItemId"
            element={<CreateFeedback />}
          />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth roles={["STAFF"]} />}></Route>
        <Route element={<RequireAuth roles={["USER", "STAFF"]} />}>
          <Route path="/chat" element={<Chat />} />
        </Route>
        <Route element={<RequireAuth roles={["USER", "STAFF", "ADMIN"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
        <Route element={<RequireAuth roles={["ADMIN", "STAFF"]} />}>
          <Route path="/vouchers" element={<VoucherManagement />} />
          <Route path="/store-orders" element={<AllOrders />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route
            path="/store-orders-items/:orderId"
            element={<OrderDetailForStaff />}
          />
        </Route>

        <Route element={<RequireAuth roles={["ADMIN"]} />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="/product/update/:id" element={<UpdateProduct />} />
        </Route>
        <Route path="/user/:id" element={<UserDetail />} />
        <Route path="/payment-return" element={<PaymentReturn />} />
      </Route>
    </Routes>
  );
};
export default App;
