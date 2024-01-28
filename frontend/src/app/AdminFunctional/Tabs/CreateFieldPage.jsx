import React from "react";
import { useState } from "react";
import Header from "../Components/Header/Header";
import { Card, Typography, InputNumber, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons"
import FieldSizePreview from "../Components/FieldsViewer/FieldSizePreview";
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
  gap: "25px",
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

  const [fieldSize, setFieldSize] = useState(8);

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
          <Button icon={<PlusOutlined />} size="large" type="primary" block>Создать</Button>
        </Card>
      </div>
    </div>
  );
}

export default CreateFieldPage;
