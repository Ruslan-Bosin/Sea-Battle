import React from "react";
import { useState } from "react";
import { Input, Button, Space } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";

// Styles
const body_div = {}
const button = {width: "100%"}
const space_divider = {
  display: 'flex',
  marginBottom: "20px"
}

function LoginForm() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  const logInClicked = () => {
    console.log("Clicked Login");
    navigate("/");
  }

  // status="error" for Inputs
  return (
    <div style={body_div}>
      <Space direction="vertical" size="middle" style={space_divider}>
        <Input placeholder="Почта" prefix={<UserOutlined/>} value={email} onChange={changeEmail}/>
        <Input.Password placeholder="Пароль" prefix={<LockOutlined/>} value={password} onChange={changePassword}/>
        <Button type="primary" icon={<LoginOutlined/>} size="large" style={button} onClick={logInClicked}>Войти</Button>
      </Space>
    </div>
  )
};

export default LoginForm;
