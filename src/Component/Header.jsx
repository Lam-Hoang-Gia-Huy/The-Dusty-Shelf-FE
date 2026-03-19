import React from "react";
import { Menu, Layout, Input, Col, Image, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import AvatarDropdown from "./Avatar";
import { useState } from "react";
import useAuth from "./Hooks/useAuth"; // Import useAuth hook
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleInfo,
  faHome,
  faRightFromBracket,
  faUpload,
  faUser,
  faMessage,
  faMagnifyingGlass,
  faFolder,
  faUserAlt,
  faTicket,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../Image/pngtree-library-icon-with-a-window-and-books-vector-png-image_6821977.png";

const { Header } = Layout;
const { Search } = Input;

const HeaderBar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth(); // Use the useAuth hook to get authentication status and setAuth function
  const [searchTerm, setSearchTerm] = useState("");
  const handleLogout = () => {
    setAuth(null);
    navigate("/");
  };

  const handleClick = (item) => {
    if (!item || !item.key) {
      return;
    }
    if (item.key !== "logout") {
      const path = item.key.toLowerCase();
      navigate(`/${path === "home" ? "" : path}`);
    }
  };
  const handleSearch = (value) => {
    if (value) {
      navigate(`/filter?name=${value}`);
    }
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Col span={2}>
        <Image src={Logo} height={65} />
      </Col>
      <Col span={13}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          onClick={handleClick}
          style={{ flex: 1, minWidth: 0 }}
        >
          {auth?.role === "USER" || !auth ? (
            <Menu.Item key="home">
              <FontAwesomeIcon size="lg" icon={faHome} />
              Home
            </Menu.Item>
          ) : null}

          {auth?.role === "ADMIN" && (
            <>
              <Menu.Item key="users">
                <FontAwesomeIcon size="lg" icon={faUserAlt} />
                User Management
              </Menu.Item>
              <Menu.Item key="store-orders">
                <FontAwesomeIcon size="lg" icon={faFolder} /> Store Orders{" "}
              </Menu.Item>
              <Menu.Item key="revenue">
                <FontAwesomeIcon size="lg" icon={faUserAlt} />
                Revenue
              </Menu.Item>
              <Menu.Item key="product-management">
                <FontAwesomeIcon size="lg" icon={faUpload} /> Product Management
              </Menu.Item>

              <Menu.Item key="vouchers">
                <FontAwesomeIcon size="lg" icon={faTicket} /> Vouchers
              </Menu.Item>
              <Menu.Item key="categories">
                <FontAwesomeIcon size="lg" icon={faTag} />
                Categories
              </Menu.Item>
            </>
          )}

          {auth && auth?.role === "USER" && (
            <>
              <Menu.Item key="cart">
                <FontAwesomeIcon size="lg" icon={faCartShopping} /> My Cart{" "}
              </Menu.Item>
              <Menu.Item key="orders">
                <FontAwesomeIcon size="lg" icon={faFolder} /> My Orders{" "}
              </Menu.Item>
            </>
          )}
          {auth && auth?.role === "STAFF" && (
            <>
              <Menu.Item key="store-orders">
                <FontAwesomeIcon size="lg" icon={faFolder} /> Store Orders{" "}
              </Menu.Item>
              <Menu.Item key="product-management">
                <FontAwesomeIcon size="lg" icon={faUpload} /> Product Management
              </Menu.Item>
              <Menu.Item key="vouchers">
                <FontAwesomeIcon size="lg" icon={faTicket} /> Vouchers
              </Menu.Item>
              <Menu.Item key="categories">
                <FontAwesomeIcon size="lg" icon={faTag} />
                Categories
              </Menu.Item>
            </>
          )}
          {auth && (auth?.role === "STAFF" || auth?.role === "USER") && (
            <Menu.Item key="chat">
              <FontAwesomeIcon size="lg" icon={faMessage} /> Chat
            </Menu.Item>
          )}
          {!auth ? (
            <Menu.Item key="login">
              <FontAwesomeIcon size="lg" icon={faUser} />
              Login
            </Menu.Item>
          ) : (
            <Popconfirm
              title="Are you sure you want to logout?"
              onConfirm={handleLogout}
              okText="Yes"
              cancelText="No"
            >
              <Menu.Item key="logout">
                {" "}
                <FontAwesomeIcon size="lg" icon={faRightFromBracket} /> Logout
              </Menu.Item>
            </Popconfirm>
          )}
        </Menu>
      </Col>
      <Col span={9} style={{ display: "flex", alignItems: "center" }}>
        {(auth?.role === "USER" || !auth) && (
          <Search
            placeholder="Search products"
            onSearch={handleSearch}
            style={{ width: 200, marginRight: 16 }}
            enterButton={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        {auth ? (
          <div style={{ marginLeft: "auto", marginRight: "15px" }}>
            <AvatarDropdown />
          </div>
        ) : null}
      </Col>
    </Header>
  );
};

export default HeaderBar;
