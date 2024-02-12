import React from "react";
import { useState } from "react";
import Header from "../Components/Header/Header";
import { Card, Typography, InputNumber, Button, Input, message, Space, Modal, Segmented } from "antd";
import { PlusOutlined, BookOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons"
import FieldSizePreview from "../Components/FieldsViewer/FieldSizePreview";
import axios from "../../Services/axios-config"
import { useNavigate } from "react-router-dom";
import Markdown from 'react-markdown';

const { Text } = Typography;
const { TextArea } = Input;


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

const full_width = {
  width: "100%"
}


function CreateFieldPage() {

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

    axios.post(create_field_url, formData, { headers })
      .then(response => {
        navigate(`/admin/allfields`);
        message.success("Поле создано");
      })
      .catch(error => {
        if (error.message === "refresh failed") {
          navigate(error.loginUrl);
        } else {
          message.error("Невозможно создать поле");
          console.error("Error: ", error);
        }
      });
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guideText, setGuideText] = useState("Эта игра строится по принципу морского боя, за совершённые покупки на ваш аккаунт начисляются «выстрелы». На виртуальном поле находятся клетки: пустые и содержащие призы. Ваша задача выбрать клетку в которой находится приз, призы не могут стоять в соседних клетках. Дважды «стрелять» одну и ту же клетку запрещено. На поле находитесь не вы одни, поэтому поторопитесь, призы ограничены.")
  const handleOk = () => {
    // guideText
    setIsModalOpen(false);
  }

  const [tab, setTab] = useState("edit");

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
          <Space.Compact style={full_width}>
            <Input maxLength={20} placeholder="Название поля" value={fieldName} onChange={(event) => setFieldName(event.target.value)} />
            <Button onClick={() => { setIsModalOpen(true) }}><BookOutlined /></Button>
          </Space.Compact>
          <Button icon={<PlusOutlined />} onClick={createField} size="large" type="primary" block>Создать</Button>
        </Card>
      </div>
      <Modal width="50%" title="Инструкция" open={isModalOpen} onOk={handleOk} onCancel={() => { setIsModalOpen(false) }} cancelText="Отмена" okText="Сохранить">
        <Segmented style={{ marginBottom: "10px" }} onChange={(value) => setTab(value)} block options={[{ label: 'Редактировать', value: 'edit', icon: <EditOutlined /> }, { label: 'Предпросмотр', value: 'preview', icon: <EyeOutlined /> },]} />
        {(tab === "edit") ? <TextArea rows={10} value={guideText} style={{ marginBottom: "30px" }} showCount maxLength={1200} onChange={(event) => { setGuideText(event.target.value) }} placeholder="Введите инструкцию: вы можете использовать разметку markdown" /> : <Markdown>{guideText}</Markdown>}
      </Modal>
    </div >
  );
}

export default CreateFieldPage;
