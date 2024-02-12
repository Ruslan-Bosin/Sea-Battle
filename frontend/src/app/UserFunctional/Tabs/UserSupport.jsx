import React from "react";
import { useState } from "react";
import { Card, Input, Button, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../../Services/axios-config"
const { TextArea } = Input;


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
  width: "600px",
  minWidth: "250px",
}
const full_width = {
  width: "100%"
}

function UserSupport() {

  const navigate = useNavigate();

  const [emai, setEmail] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const support_url = "http://127.0.0.1:8000/api/support-request/"



  const form_submit = () => {
    const access_token = (localStorage.getItem("accessToken") || "");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token,
    };

    axios.post(support_url, { description: messageContent, mail: emai}, {headers})
      .then(response => {
        message.success("Ваше сообщение было отправлено");
        navigate("/");
      })
      .catch(error => {
        if (error.message === "refresh failed") {
          navigate(error.loginUrl);
        } else {
          console.error("Error: ", error);
        }
      });
  };

  return (
    <div style={body_div}>
      <Card title="Поддержка" hoverable style={card_style} extra={<a href="/">на главную</a>}>
        <Space direction="vertical" size="middle" style={full_width}>
          <Input placeholder="Введите ваш контактный email" value={emai} onChange={(event) => setEmail(event.target.value)} />
          <TextArea placeholder="Введите ваше сообщение" value={messageContent} onChange={(event) => setMessageContent(event.target.value)} autoSize={{ minRows: 6, maxRows: 12, }} />
          <Button type="primary" style={full_width} onClick={form_submit}>Отправить</Button>
        </Space>
      </Card>
    </div>
  );
};

export default UserSupport;