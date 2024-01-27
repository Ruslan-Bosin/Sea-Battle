import React, { useState } from "react";
import { Card, Button, Input, Space, Tooltip } from "antd";
import { MailOutlined, CodeOutlined, LockOutlined, InfoCircleOutlined, LoginOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

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

function AdminForgotPassword() {

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

    const recoverClicked = () => {
        /*
        Запрос POST:
        { email, code, password }
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
            <Card title="Новый пароль" hoverable style={card_style} extra={<a href="/adminauth/login">назад</a>}>
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


export default AdminForgotPassword;