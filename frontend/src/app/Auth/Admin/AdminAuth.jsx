import React, { useState } from "react";
import { Card, Radio } from "antd";
import { useNavigate, Outlet } from "react-router-dom";

//Styles
const body_div = {
  position: "absolute",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}
const card_style = {
  width: "400px",
  minWidth: "250px"
}
const auth_options_group = {display: "flex",}
const auth_option_button = {flex: 1, display: "flex", justifyContent: "center"}

function AdminAuth() {

  const navigate = useNavigate();
  const [auth_option, setAuth_option] = useState("login");
  const change_auth_option = (event) => {
    setAuth_option(event.target.value);
    if (event.target.value === "login") {
      navigate("/adminauth/login");
    } else {
      navigate("/adminauth/register");
    }
  };

  return (
    <div style={body_div}>
      <Card title="Авторизация" hoverable style={card_style}>
        <Outlet/>
        <Radio.Group value={(window.location.pathname === "/adminauth/register") ? "register" : auth_option} style={auth_options_group} onChange={change_auth_option}>
          <Radio.Button value="login" style={auth_option_button}>Вход</Radio.Button>
          <Radio.Button value="register" style={auth_option_button}>Регистрация</Radio.Button>
        </Radio.Group>
      </Card>
    </div>
  );

};

export default AdminAuth;