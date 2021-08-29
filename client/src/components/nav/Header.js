import React, { useState } from "react";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  ProfileOutlined,
  UserOutlined,
  DashboardOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Search from "../forms/Search";
import token from "../../images/token-image.png";
import defaultPfp from "../../images/default-profile-image.jpg";

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");

  let dispatch = useDispatch();
  let { user, cart } = useSelector((state) => ({ ...state }));

  let history = useHistory();

  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
    console.log(user.avatar);
    console.log(defaultPfp);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item className="float-left" key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Item>

      <Item className="float-left" key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop</Link>
      </Item>

      <Item className="float-left" key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {!user && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link to="/register">Register</Link>
        </Item>
      )}

      {!user && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to="/login">Login</Link>
        </Item>
      )}

      {user && (
        <>
          <SubMenu
            icon={
              user.avatar === undefined || user.avatar === null ? (
                <img
                  alt="avatar"
                  src={defaultPfp}
                  className="p-1 rounded-circle mr-1"
                  height="40px"
                />
              ) : (
                <img
                  alt="avatar"
                  src={user.avatar}
                  className="p-1 rounded-circle mr-1"
                  height="40px"
                />
              )
            }
            title={
              user.email && (
                <span className="font-weight-bold">
                  {user.email.split("@")[0]}
                </span>
              )
            }
            className="float-right ml-2"
          >
            {user && user.role === "subscriber" && (
              <Item>
                <Link to="/user/history">Profile</Link>
              </Item>
            )}

            {user && user.role === "admin" && (
              <>
                <Item icon={<ProfileOutlined />}>
                  <Link to="/user/history">Profile</Link>
                </Item>
                <Item icon={<DashboardOutlined />}>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </Item>
              </>
            )}

            <Item icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Item>
          </SubMenu>

          <div className="float-right border-right border-left px-2 rounded">
            <img className="pr-2" alt="token" src={token} height="25px" />
            <span className="b-1 font-weight-bold text-info">
              {user.tokens}
            </span>
          </div>
        </>
      )}

      <span className="float-left p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
