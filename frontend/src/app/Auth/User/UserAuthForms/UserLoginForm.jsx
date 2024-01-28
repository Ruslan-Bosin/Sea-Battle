import React from "react";
import { useState } from "react";
import { Input, Button, Space } from "antd";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons"
// import { useNavigate } from "react-router-dom";

// Styles
const body_div = {}
const full_width = { width: "100%" }
const space_divider = {
  display: 'flex',
  marginBottom: "20px"
}

function UserLoginForm() {

  // const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginClicked = () => {
    /* 
    Запрос POST:
    { email, password }
    -> { message, token(s) }
    в message указать ошибки при валидации почты или пароля
    или успешность входа
    */
    // navigate("/");
  }

  return (
    <div style={body_div}>
      <Space direction="vertical" size="middle" style={space_divider}>
        <Input placeholder="Почта" prefix={<MailOutlined />} value={email} onChange={event => setEmail(event.target.value)} />
        <Input.Password placeholder="Пароль" prefix={<LockOutlined />} value={password} onChange={event => setPassword(event.target.value)} />
        <Button type="primary" icon={<LoginOutlined />} size="large" style={full_width} onClick={loginClicked}>Войти</Button>
        <Button type="link" size="small" style={full_width} href="/userauth/forgotpassword">не помню пароль</Button>
      </Space>
    </div>
  )
};

export default UserLoginForm;
