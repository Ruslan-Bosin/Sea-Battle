import React from "react";
import { useState } from "react";
import { PlusOutlined, InboxOutlined, } from "@ant-design/icons";
import { Modal, Input, Space, Upload, message, Tooltip } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Dragger } = Upload;

function EmptyCell(props) {

  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {setIsHover(true);};
  const handleMouseLeave = () => {setIsHover(false);};

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState();

  const createNewPrizeSumbit = () => {
    message.info("...create");

    console.log(title);
    console.log(description);
    console.log(imageFile);

    const formData = new FormData()
    formData.append('avatar', imageFile);
    formData.append('name', title);
    formData.append('description', description);
    axios.post('http://127.0.0.1:8000/api/upload_prize_avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    setCreateModalOpen(false);
  };

  // Styles with state
  const body_div = {
    background: (isHover ? "#F5F5F5FF" : "#0505050F"),
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  const plus_icon = {
    transform: (isHover ? "scale(1.2)" : "scale(1)"),
    transition: "all 0.2s ease-in-out"
  }

  return (
    <>
      <Tooltip title="Нажмите для добавления нового приза">
        <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setCreateModalOpen(true)}>
          <PlusOutlined style={plus_icon} />
        </div>
      </Tooltip>
      <Modal open={createModalOpen} title="Добавление нового приза" cancelText="Отмена" okText="Добавить" onCancel={() => setCreateModalOpen(false)} onOk={createNewPrizeSumbit}>
        <Space size="small" direction="vertical" style={{ width: "100%" }}>
          <Input value={title} placeholder="Название приза" onChange={(event) => setTitle(event.target.value)} />
          <TextArea value={description} placeholder="Описание приза" autoSize={{ minRows: 2, maxRows: 6, }} onChange={(event) => setDescription(event.target.value)} />
          <Dragger accept=".png,.jpg" maxCount={1} customRequest={({ file }) => { setImageFile(file) }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Щелкните или перетащите для добавления фото</p>
            <p className="ant-upload-hint">
              Вы можете загрузить фото не больше 2 мегабайт с расширением png или jpg
            </p>
          </Dragger>
        </Space>
      </Modal>
    </>
  );
}

export default EmptyCell;