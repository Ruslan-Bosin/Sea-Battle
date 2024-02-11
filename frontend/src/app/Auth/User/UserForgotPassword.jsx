import React, { useState } from "react";
import { Card, Button, Input, Space, Tooltip, message } from "antd";
import { MailOutlined, CodeOutlined, LockOutlined, InfoCircleOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
const full_width = { width: "100%" }

function UserForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeDisabled, setCodeDisabled] = useState(true);
  const [password, setPassword] = useState("");
  const email_token_url = 'http://127.0.0.1:8000/api/reset_email_token';
  const update_url = 'http://127.0.0.1:8000/api/update_pass';

  const checkEmailClicked = () => {
    const request = {
      email: email
    }
    axios.post(email_token_url, request).then(response => {
      const data = response.data;
      if (data.message === "Ok") {
        message.success("Письмо с кодом подтверждения отправлено на вашу почту");
        setCodeDisabled(false);
      } else if (data.message === "Пользователь с такой почтой не существует") {
        message.warning("Пользователь с такой почтой не существует")
        setCodeDisabled(false);
      } else if (data.message === "На эту почту уже отправлено подтверждение") {
        message.warning("На эту почту уже отправлено подтверждение")
        setCodeDisabled(false);
      } else {
        message.error(data.message);
      }
    })
  };

  const recoverClicked = () => {
    const request = {
      email: email,
      email_token: code,
      password: password
    }
    axios.post(update_url, request).then(response => {
      message.success("Пароль успешно обновлен");
      const { access, refresh } = response.data;
      console.log(response.data);
      console.log(access, refresh);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("role", "user");
      navigate('/');
    }).catch(error => {
      message.error(error.response.data.message);
    })

  };

  const password_tooltip = (
    <>
      Пароль должен:<br />
      - быть не короче 8 символов<br />
      - содержать цифры<br />
      - содержать заглавные и строчные буквы
    </>
  )

  return (
    <div style={body_div}>
      <Card title="Новый пароль" hoverable style={card_style} extra={<a href="/userauth/login">назад</a>}>
        <Space direction="vertical" size="middle" style={full_width}>

          <Space.Compact style={full_width}>
            <Input placeholder="Почта" prefix={<MailOutlined />} value={email} onChange={event => setEmail(event.target.value)} />
            <Button onClick={checkEmailClicked}>Проверить</Button>
          </Space.Compact>

          <Input placeholder="Код для проверки почты" disabled={codeDisabled} prefix={<CodeOutlined />} value={code} onChange={event => setCode(event.target.value)} />

          <Space.Compact style={full_width}>
            <Input.Password placeholder="Пароль" prefix={<LockOutlined />} value={password} onChange={event => setPassword(event.target.value)} />
            <Tooltip title={password_tooltip}>
              <Button icon={<InfoCircleOutlined />} />
            </Tooltip>
          </Space.Compact>

          <Button type="primary" icon={<LoginOutlined />} size="large" style={full_width} onClick={recoverClicked}>Обновить и войти</Button>

        </Space>
      </Card>
    </div>
  );

};


export default UserForgotPassword;