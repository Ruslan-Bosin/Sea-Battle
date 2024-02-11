import React from "react";
import { useState } from "react";
import { Input, Button, Space, Tooltip, message } from "antd";
import { FontSizeOutlined, LockOutlined, LoginOutlined, InfoCircleOutlined, MailOutlined, CodeOutlined, SafetyCertificateOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import axios from 'axios'


// Styles
const body_div = {}
const full_width = { width: "100%" }
const space_divider = {
  display: 'flex',
  marginBottom: "20px"
}


function AdminRegisterForm() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeDisabled, setCodeDisabled] = useState(true);
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("")
  const email_token_url = 'http://127.0.0.1:8000/api/send_email_token'
  const register_url = 'http://127.0.0.1:8000/api/register'

  const checkEmailClicked = () => {
    const request = {
      email: email
    }
    axios.post(email_token_url, request).then(response => {
      const data = response.data;
      if (data.message === "Ok") {
        message.success("Письмо с кодом подтверждения отправлено на вашу почту");
        setCodeDisabled(false);
      } else if (data.message === "На эту почту уже отправлено подтверждение") {
        message.warning("На эту почту уже отправлено подтверждение")
        setCodeDisabled(false);
      } else {
        message.error(data.message);
      }
    })
  };

  const registerClicked = () => {
    const request = {
      email: email,
      username: title,
      email_token: code,
      password: password,
      admin_code: secretCode,
      is_admin_reg: true
    }
    axios.post(register_url, request).then(response => {
      message.success("Аккаунт успешно создан");
      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("role", "admin");
      navigate('/admin/allfields');
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
      <Space direction="vertical" size="middle" style={space_divider}>

        <Input placeholder="Название" prefix={<FontSizeOutlined />} value={title} onChange={event => setTitle(event.target.value)} />

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

        <Space.Compact style={full_width}>
          <Input.Password placeholder="Секретный код" prefix={<SafetyCertificateOutlined />} value={secretCode} onChange={event => setSecretCode(event.target.value)} />
          <Tooltip title="Специальный секретный код известный только администрации и выдаваемый только организациям">
            <Button icon={<InfoCircleOutlined />} />
          </Tooltip>
        </Space.Compact>


        <Button type="primary" icon={<LoginOutlined />} size="large" style={full_width} onClick={registerClicked}>Создать</Button>
      </Space>
    </div>
  )
};

export default AdminRegisterForm;
