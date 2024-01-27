import React from "react";
import { useState } from "react";
import { Card, Avatar, Input, Space, Button } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";


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
  minWidth: "250px",
}
const card_content = {
  display: "flex",

}
const right_block = {
  display: "flex",
  marginLeft: "10px",
  flexDirection: "column",
  gap: "10px",
  alignItems: "start"
}

function AdminSettings() {

  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("Название");

  return (
    <div style={body_div}>
      <Card title="Настройки" hoverable bodyStyle={card_content} style={card_style} extra={<a onClick={navigate(-1)} href="/#">на главную</a>}>
        <Space size="middle">
          <Avatar shape="square" size={128} icon={<UserOutlined />} />
          <div style={right_block}>
            <Input placeholder="Название" variant="filled" value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            <Button icon={<UploadOutlined />}>Установить аватар</Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default AdminSettings;