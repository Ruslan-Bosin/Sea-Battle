import React from "react";
import { useState } from "react";
import { Input, Button, Space, message } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
  const [emailError, setEmailError] = useState("");



  const changeEmail = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    // if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
    //   setEmailError("Некорректный адрес электронной почты");
    // } else {
    //   setEmailError("");
    // }
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  const logInClicked = async () => {
    const request_data = {
      email: email,
      password: password
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token', request_data);
      const { access, refresh } = response.data;
      // Сохраняем токены в localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      message.success('Вы успешно авторизованы!');
      navigate('/'); // Переход на главную страницу
    } catch(error) {
      console.error('Ошибка авторизации:', error);
      message.error('Ошибка авторизации. Пожалуйста, проверьте введенные данные.');

    }
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
