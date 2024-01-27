import React from "react";
import { useState } from "react";
import { Input, Button, Space, Tooltip } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined, InfoCircleOutlined, MailOutlined, CodeOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";

// Styles
const body_div = {}
const full_width = { width: "100%" }
const space_divider = {
  display: 'flex',
  marginBottom: "20px"
}


function UserRegisterForm() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeDisabled, setCodeDisabled] = useState(true);
  const [password, setPassword] = useState("");

  const checkEmailClicked = () => {
    /*
    Запрос POST:
    { email }
    -> { message }
    в message указаь ошибку или успешнсть
    */
  };

  const registerClicked = () => {
    /*
    Запрос POST:
    { name, email, code, password }
    -> { message, token(s) }
    в message подробно указаь ошибку или успешнсть (если пароль слабый тоже тут писать)
    */
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

        <Input placeholder="Имя" prefix={<UserOutlined />} value={name} onChange={event => setName(event.target.value)} />

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

        <Button type="primary" icon={<LoginOutlined />} size="large" style={full_width} onClick={registerClicked}>Создать</Button>
      </Space>
    </div>
  )
};

export default UserRegisterForm;
