import { useEffect, useState } from "react";
import { InboxOutlined, GiftTwoTone } from "@ant-design/icons";
import { Modal, Input, Space, Upload, message, Popover, Image, Button, Popconfirm } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Dragger } = Upload;

const img_fallback = "data:image/png;base64,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"

function PrizeCell(props) {

  /*
  Запрос POST (c token-ом)
  { fieldID, coordinate }
  -> { prizeTitle, prizeImage }

  Запрос POST (c token-ом)
  { fieldID, coordinate } -> { message } - удаление приза

  Запрос GET (c token-ом)
  { fieldID, coordinate }
  -> { prizeTitle, prizeDescription }

  Запрос POST (c token-ом )
  { fieldID, coordinate }
  -> { prizeTitle, prizeDescription, prizeImage }
  */

  const [isHover, setIsHover] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prizeAvatarUrl, setPrizeAvatarUrl] = useState("");

  const handleMouseEnter = () => { setIsHover(true); };
  const handleMouseLeave = () => { setIsHover(false); };

  const onChangesSubmition = () => {
    message.info("...edit");
    // ... (your existing code)
    setModalOpen(false);
  };

   useEffect(() => {
    const access_token = localStorage.getItem("accessToken") || "";
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,
    };


    axios.get(`http://127.0.0.1:8000/api/get_prize_avatar/${props.fieldID}/${props.coordinate}/`, {headers})
        .then(response => {
            const prizeAvatarUrl = response.data.prize_avatar_url;
            console.log(prizeAvatarUrl);
            // Handle the prize avatar URL as needed
        })
        .catch(error => {
            console.error(error);
        });
  }, []);

  const deletePrize = () => {
    const formData = new FormData();
    formData.append('coordinate', props.coordinate);
    formData.append('fieldID', props.fieldID);
    axios.post('http://127.0.0.1:8000/api/delete_prize', formData)
      .then(() => {
        setModalOpen(false);
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
        <Image preview={true} src={"prizeAvatarUrl"} width="2  00px" height="200px" fallback={img_fallback}/>
        <Space style={{width: "100%"}}>
          <Button type="dashed" onClick={() => setModalOpen(true)}>Изменить</Button>
          <Popconfirm title="Вы точно хотите удалить?" okText="Да" cancelText="Нет" onConfirm={deletePrize}>
           <Button danger type="text">Удалить</Button>
          </Popconfirm>
        </Space>
      </Space>
    </div>
  );

  return (
    <>
      <Popover content={popover_content} title="Название приза">
        <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <GiftTwoTone style={prize_icon} />
        </div>
      </Popover>
      <Modal zIndex={1031} open={modalOpen} title="Изменение приза" cancelText="Отмена" okText="Обновить" onCancel={() => setModalOpen(false)} onOk={onChangesSubmition}>
        <Space size="small" direction="vertical" style={{ width: "100%" }}>
          <Input value={title} placeholder="Название приза" onChange={(event) => setTitle(event.target.value)} />
          <TextArea value={description} placeholder="Описание приза" autoSize={{ minRows: 2, maxRows: 6, }} onChange={(event) => setDescription(event.target.value)} />
          <Dragger >
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

export default PrizeCell;