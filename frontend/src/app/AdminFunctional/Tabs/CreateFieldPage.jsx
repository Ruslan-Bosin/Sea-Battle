import React from "react";
import { useState } from "react";
import Header from "../Components/Header/Header";
import { Card, Typography, InputNumber, Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons"
import FieldSizePreview from "../Components/FieldsViewer/FieldSizePreview";
import axios from "axios";
import {useNavigate} from "react-router-dom";
const { Text } = Typography;


// Styles
const body_div = {
  postion: "absolute",
  width: "100vw",
  height: "100vh",
  background: "#F5F5F5FF",
  display: "flex",
  flexDirection: "column"
}

const create_field_block = {
  flexGrow: 1,
  padding: "2%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
}

const card_body = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "0px 20px"
}

const set_size_block = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px"
}

const input = {
  width: "50px"
}


function CreateFieldPage() {

  /*
  Запрос POST (с token-ом)
  { size }
  -> { fieldId }
  */

  const navigate = useNavigate();

  const [fieldSize, setFieldSize] = useState(8);
  const [fieldName, setFieldName] = useState("");
  const access_token = (localStorage.getItem("accessToken") || "");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  };
  const create_field_url = "http://127.0.0.1:8000/api/create_field";

  const createField = () => {
    const formData = new FormData();
    formData.append('name', fieldName);
    formData.append('size', fieldSize);

    axios.post(create_field_url, formData, {headers})
      .then(response => {
        console.log(response);
        navigate("/");
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div style={body_div}>
      <Header selectedTab={1} showEditorTab={false} />
      <div style={create_field_block}>
        <Card bodyStyle={card_body}>
          <FieldSizePreview size={fieldSize} />
          <div style={set_size_block}>
            <Text>Размер поля:</Text>
            <InputNumber style={input} size="small" min={2} max={14} defaultValue={fieldSize} onChange={(value) => { setFieldSize(value) }} />
            <Text>на</Text>
            <InputNumber value={fieldSize} style={input} size="small" disabled />
          </div>
          <Input placeholder="Название поля" value={fieldName} onChange={(event) => setFieldName(event.target.value)} />
          <Button icon={<PlusOutlined />} onClick={createField} size="large" type="primary" block>Создать</Button>
        </Card>
      </div>
    </div>
  );
}

export default CreateFieldPage;
