import React from "react";
import { useState } from "react";
import { PlusOutlined, InboxOutlined, GiftTwoTone, StopTwoTone, LineOutlined } from "@ant-design/icons";
import { Modal, Input, Space, Upload, message, Popover, Image, Button, Typography, Tooltip } from "antd";

const { TextArea } = Input;
const { Dragger } = Upload;
const { Title, Text } = Typography;


const img_fallback = "data:image/png;base64,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"

const upload_props = {
  name: 'file',
  multiple: false,
  accept: ".jpg,.png",
  maxCount: 1,
  action: 'url',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`Файл ${info.file.name} загружен`);
    } else if (status === 'error') {
      message.error(`Ошибка загрузки файла ${info.file.name}`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};


function FieldCell(props) {

  // Main props
  const coordinate = props.coordinate;
  const status = props.status;
  
  // Hover animmation state
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {setIsHover(true);};
  const handleMouseLeave = () => {setIsHover(false);};
  const [isHoverPrize, setIsHoverPrize] = useState(false);
  const handleMouseEnterPrize = () => {setIsHoverPrize(true);};
  const handleMouseLeavePrize = () => {setIsHoverPrize(false);};
  const [isHoverMissed, setIsHoverMissed] = useState(false);
  const handleMouseEnterMissed = () => {setIsHoverMissed(true);};
  const handleMouseLeaveMissed = () => {setIsHoverMissed(false);};
  const [isHoverWin, setIsHoverWin] = useState(false);
  const handleMouseEnterWin = () => {setIsHoverWin(true);};
  const handleMouseLeaveWin = () => {setIsHoverWin(false);};

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

  const body_div_prize = {
    background: (isHoverPrize ? "#F5F5F5FF" : "#0505050F"),
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "thick double #4096ff",
    boxShadow: (isHoverPrize ? "0 5px 15px rgba(64, 150, 255,0.5)" : "0 5px 15px rgba(0,0,0,0)"),
    transition: "all 0.2s ease-in-out"
  }

  const body_div_missed = {
    background: (isHoverMissed ? "#F5F5F5FF" : "#0505050F"),
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "thick double rgb(255, 197, 61)",
    boxShadow: (isHoverMissed ? "0 5px 15px rgba(255, 197, 61, 0.5)" : "0 5px 15px rgba(0,0,0,0)"),
    transition: "all 0.2s ease-in-out"
  }

  const body_div_win= {
    background: (isHoverWin ? "#F5F5F5FF" : "#0505050F"),
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "thick double rgb(255, 77, 79)",
    boxShadow: (isHoverWin ? "0 5px 15px rgba(255, 77, 79, 0.5)" : "0 5px 15px rgba(0,0,0,0)"),
    transition: "all 0.2s ease-in-out"
  }

  const plus_icon = {
    transform: (isHover ? "scale(1.2)" : "scale(1)"),
    transition: "all 0.2s ease-in-out"
  }

  const prize_icon = {
    transform: (isHoverPrize ? "scale(2.5)" : "scale(2)"),
    transition: "all 0.2s ease-in-out",
  }

  const missed_icon = {
    transform: (isHoverMissed ? "scale(2.5)" : "scale(2)"),
    transition: "all 0.2s ease-in-out"
  }

  const win_icon = {
    transform: (isHoverWin ? "scale(2.5)" : "scale(2)"),
    transition: "all 0.2s ease-in-out"
  }

  // Prize & Edit States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [prizeTitle, setPrizeTitle] = useState("")
  const [prizeDescription, setPrizeDescription] = useState("")

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [prizeTitleEdit, setPrizeTitleEdit] = useState("")
  const [prizeDescriptionEdit, setPrizeDescriptionEdit] = useState("")

  // Prize - add
  const createNewPrizeSumbit = () => {
    message.info("...create");
    setCreateModalOpen(false);
  };

  // 
  if (status === "empty") {
    return (
      <>
        <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setCreateModalOpen(true)}>
          <PlusOutlined style={plus_icon}/>
        </div>
        <Modal open={createModalOpen} title="Добавление нового приза" cancelText="Отмена" okText="Добавить" onCancel={() => setCreateModalOpen(false)} onOk={createNewPrizeSumbit}>
          <Space size="small" direction="vertical" style={{width: "100%"}}>
            <Input value={prizeTitle} placeholder="Название приза" onChange={(event) => setPrizeTitle(event.target.value)}/>
            <TextArea value={prizeDescription} placeholder="Описание приза" autoSize={{minRows: 2, maxRows: 6,}} onChange={(event) => setPrizeDescription(event.target.value)}/>
            <Dragger {...upload_props}>
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

  // Prize - edit
  const popover_content = (
    <div>
      <Space direction="vertical">
        <Image preview={true} src="" width="2  00px" height="200px" fallback={img_fallback}/>
        <Space block style={{width: "100%"}}>
          <Button type="dashed" onClick={() => setEditModalOpen(true)}>Изменить</Button>
          <Button danger type="text">Удалить</Button>
        </Space>
      </Space>
    </div>
  );

  const editPrizeSumbit = () => {
    message.info("...edit");
    setEditModalOpen(false);
  };

  if (status === "prize") {
    return (
      <>
        <Popover content={popover_content} title="Название приза">
          <div style={body_div_prize} onMouseEnter={handleMouseEnterPrize} onMouseLeave={handleMouseLeavePrize}>
            <GiftTwoTone style={prize_icon}/>
          </div>
        </Popover>
        <Modal zIndex={1031} open={editModalOpen} title="Изменение приза" cancelText="Отмена" okText="Обновить" onCancel={() => setEditModalOpen(false)} onOk={editPrizeSumbit}>
          <Space size="small" direction="vertical" style={{width: "100%"}}>
            <Input value={prizeTitleEdit} placeholder="Название приза" onChange={(event) => setPrizeTitleEdit(event.target.value)}/>
            <TextArea value={prizeDescriptionEdit} placeholder="Описание приза" autoSize={{minRows: 2, maxRows: 6,}} onChange={(event) => setPrizeDescriptionEdit(event.target.value)}/>
            <Dragger {...upload_props}>
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

  // Missed
  if (status === "missed") {
    return (
      <Tooltip title="Промах! В эту клетку стреляли">
        <div style={body_div_missed} onMouseEnter={handleMouseEnterMissed} onMouseLeave={handleMouseLeaveMissed}>
          <StopTwoTone twoToneColor="#ffc53d" style={missed_icon}/>
        </div>
      </Tooltip>
    );
  }

  // Win
  const popover_content_win = (
    <div>
      <Space direction="horizonatl">
        <Image preview={true} src="" width="2  00px" height="200px" fallback={img_fallback}/>
        <Space direction="vertical">
          <Text>Приз выиграл: </Text>
          <Text code copyable>Никнеймпользователя</Text>
        </Space>
      </Space>
    </div>
  );

  if (status === "win") {
    return (
      <Popover content={popover_content_win} title="Название приза">
        <div style={body_div_win} onMouseEnter={handleMouseEnterWin} onMouseLeave={handleMouseLeaveWin}>
          <GiftTwoTone twoToneColor="#ff4d4f" style={win_icon}/>
        </div>
      </Popover>
    );
  }

  // InGame
  const popover_content_InGame = (
    <div>
      <Space direction="vertical">
        <Image preview={true} src="" width="2  00px" height="200px" fallback={img_fallback}/>
        <Text type="secondary">Приз ещё никто не выиграл</Text>
      </Space>
    </div>
  );

  if (status === "in_game") {
    return (
      <Popover content={popover_content_InGame} title="Название приза">
        <div style={body_div_prize} onMouseEnter={handleMouseEnterPrize} onMouseLeave={handleMouseLeavePrize}>
          <GiftTwoTone style={prize_icon}/>
        </div>
      </Popover>
    );
  }

  // Untached
  if (status === "untached") {
    return (
      <Tooltip title="В это клетку ещё не стреляли">
        <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <LineOutlined />
        </div>
      </Tooltip>
    );
  }

  // Error message
  return (
    <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      ERROR
    </div>
  );
};

export default FieldCell;
