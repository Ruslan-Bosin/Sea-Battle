import React, { useEffect } from "react";
import { useState } from "react";
import { Card, Avatar, Input, Space, Button, Upload, message } from "antd";
import { UserOutlined, UploadOutlined, SaveOutlined } from "@ant-design/icons"
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
  alignItems: "start",
  maxWidth: "185px",
  overflowX: "scroll"
}

function UserSettings() {

  const [imageFile, setImageFile] = useState("");
  const [newImageFile, setNewImageFile] = useState("");
  const [username, setUsername] = useState("Не загрузилось имя");
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const get_user_url = "http://127.0.0.1:8000/api/get_user";
  const update_name_url = "http://127.0.0.1:8000/api/update_username/";
  const update_avatar_url = "http://127.0.0.1:8000/api/update_avatar/";

  const access_token = (localStorage.getItem("accessToken") || "");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  };

  useEffect(() => {
    axios.get(get_user_url, { headers }).then(response => {

      setUsername(response.data.username);
      setImageFile(response.data.avatar);
    })
  }, [])


  const saveTitle = () => {
    axios.post(update_name_url, { new_username: username }, { headers })
      .then(response => {
        console.log(response);
        message.success("Имя успешно изменено");
      })
      .catch(error => {
        console.error("Error: " + error);
      });

  }
  const saveImage = () => {
    const formData = new FormData();
    setImageFile(newImageFile)
    formData.append('avatar', newImageFile);

    axios.post(update_avatar_url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + access_token
      }
    })
      .then(response => {
        console.log(response);
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div style={body_div}>
      <Card title="Настройки" hoverable bodyStyle={card_content} style={card_style} extra={<a href="/">на главную</a>}>
        <Space size="middle">
          <Avatar shape="square" size={150} src={imageFile} icon={<UserOutlined />} />
          <div style={right_block}>

            <Space.Compact>
              <Input placeholder="Имя" value={username} onChange={(event) => setUsername(event.target.value)} />
              <Button icon={<SaveOutlined />} onClick={saveTitle}></Button>
            </Space.Compact>
            <Upload previewFile={false} accept=".png,.jpg" maxCount={1} customRequest={({ file }) => { setNewImageFile(file); setUploadDisabled(false) }} showUploadList={true}>
              <Button icon={<UploadOutlined />} >Выбрать аватар</Button>
            </Upload>
            <Button disabled={uploadDisabled} type="primary" onClick={saveImage} icon={<SaveOutlined />}>Загрузить</Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default UserSettings;