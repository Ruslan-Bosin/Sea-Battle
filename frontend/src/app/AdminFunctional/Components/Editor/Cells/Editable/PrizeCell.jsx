import { useEffect, useState, useRef } from "react";
import { InboxOutlined, GiftTwoTone, CloseCircleFilled } from "@ant-design/icons";
import { Modal, Input, Space, Upload, message, Popover, Image, Button, Popconfirm } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Dragger } = Upload;

const img_fallback = "data:image/png;base64,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"

function PrizeCell(props) {
  const socketRef = useRef(null);

  const [isHover, setIsHover] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [data, setData] = useState({
    prize_name: "Название не загрузилось",
    prize_avatar_url: ""
  });

  const handleMouseEnter = () => { setIsHover(true); };
  const handleMouseLeave = () => { setIsHover(false); };
  const cell_prize_info = "http://127.0.0.1:8000/api/get_prize";
  const access_token = (localStorage.getItem("accessToken") || "");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  };
  const params = {
    'game_id': props.fieldID,
    'coord': props.coordinate
  };
  const socket_message = {
    message: "update_field",
  };
  const [updateTrigger, setUpdateTrigger] = useState(0);


  useEffect(() => {
    socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + props.fieldID);
    axios.get(cell_prize_info, { params, headers })
      .then((response) => {
        setData(response.data);
        setTitle(response.data.prize_name);
        setDescription(response.data.prize_title)
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [updateTrigger])

  const deletePrize = () => {
    const formData = new FormData();
    formData.append('coordinate', props.coordinate);
    formData.append('fieldID', props.fieldID);
    axios.post('http://127.0.0.1:8000/api/delete_prize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + access_token,
      }
    })
      .then(() => {
        setModalOpen(false);
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify(socket_message));
        } else {
          socketRef.current.onopen = function (event) {
            socketRef.current.send(JSON.stringify(socket_message));
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onChangesSubmition = () => {
    const formData = new FormData();
    formData.append('coordinate', props.coordinate);
    formData.append('fieldID', props.fieldID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('imageFile', imageFile);

    axios.post('http://127.0.0.1:8000/api/change_prize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + access_token,
      }
    })
      .then(() => {
        setModalOpen(false);
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
      })
      .catch(error => {
        console.error(error);
      });
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
    border: "thick double #4096ff",
    boxShadow: (isHover ? "0 5px 15px rgba(64, 150, 255,0.5)" : "0 5px 15px rgba(0,0,0,0)"),
    transition: "all 0.2s ease-in-out"
  }

  const prize_icon = {
    transform: (isHover ? "scale(2.5)" : "scale(2)"),
    transition: "all 0.2s ease-in-out",
  }

  const popover_content = (
    <div>
      <Space direction="vertical">
        <Image style={{ objectFit: "cover" }} preview={true} src={data.prize_avatar_url} width="200px" height="200px" fallback={img_fallback} />
        <Space style={{ width: "100%" }}>
          <Button type="dashed" onClick={() => setModalOpen(true)}>Изменить</Button>
          <Popconfirm icon={<CloseCircleFilled style={{ color: "red" }} />} okButtonProps={{ danger: true }} title="Вы точно хотите удалить?" okText="Да, удалить" cancelText="Отменить" onConfirm={deletePrize}>
            <Button danger type="dashed">Удалить</Button>
          </Popconfirm>
        </Space>
      </Space>
    </div>
  );

  return (
    <>
      <Popover content={popover_content} title={data.prize_name}>
        <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <GiftTwoTone style={prize_icon} />
        </div>
      </Popover>
      <Modal zIndex={1031} open={modalOpen} title="Изменение приза" cancelText="Отмена" okText="Обновить" onCancel={() => setModalOpen(false)} onOk={onChangesSubmition}>
        <Space size="small" direction="vertical" style={{ width: "100%" }}>
          <Input value={title} placeholder="Название приза" onChange={(event) => setTitle(event.target.value)} />
          <TextArea value={description} placeholder="Описание приза" autoSize={{ minRows: 2, maxRows: 6, }} onChange={(event) => setDescription(event.target.value)} />
          <Dragger accept=".png,.jpg" maxCount={1} customRequest={({ file }) => { setImageFile(file) }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Щелкните или перетащите для установки нового фото</p>
            <p className="ant-upload-hint">
              Вы можете загрузить фото не больше 2 мегабайт с расширением png или jpg
            </p>
          </Dragger>
        </Space>
      </Modal>
    </>
  );
}

export default PrizeCell;