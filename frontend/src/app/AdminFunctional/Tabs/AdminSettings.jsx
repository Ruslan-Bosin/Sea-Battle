import React from "react";
import { useState } from "react";
import { Card, Avatar, Input, Space, Button, Upload } from "antd";
import { UserOutlined, UploadOutlined, SaveOutlined } from "@ant-design/icons"


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

  /*
  Запрос GET (с token-ом)
  -> { name, avatar }
  avatar - это ссылка на картинку

  Запрос POST (с token-ом)
  ... загрузка картинки

  Запрос POST (с token-ом)
  { title }
  -> (какое-нибудь сообщение)
  */

  const [title, setTitle] = useState("Название");
  const [uploadDisabled, setUploadDisabled] = useState(true);

  const saveTitle = () => {

  }

  return (
    <div style={body_div}>
      <Card title="Настройки" hoverable bodyStyle={card_content} style={card_style} extra={<a href="/">на главную</a>}>
        <Space size="middle">
          <Avatar shape="square" size={150} icon={<UserOutlined />} />
          <div style={right_block}>
            <Space.Compact>
              <Input placeholder="Название" value={title} onChange={(event) => setTitle(event.target.value)} />
              <Button icon={<SaveOutlined />} onClick={saveTitle}></Button>
            </Space.Compact>
            
            <Upload>
              <Button icon={<UploadOutlined />}>Выбрать аватар</Button>
            </Upload>
            <Button disabled={uploadDisabled} type="primary" icon={<SaveOutlined />}>Загрузить</Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default AdminSettings;