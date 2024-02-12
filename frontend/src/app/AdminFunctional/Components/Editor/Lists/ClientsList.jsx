import React from "react";
import { useState, useEffect, useRef } from "react";
import { List, Avatar, Modal, InputNumber, message, Popconfirm } from "antd"
import { PlusSquareOutlined, UserOutlined, CloseOutlined, CloseCircleFilled } from "@ant-design/icons"
import NoData from "../../FieldsViewer/NoData";
import axios from "axios"
import { Navigate, useNavigate } from "react-router";

// Styles
const icon = {
  backgroundColor: '#91caff',
  color: '#003eb3',
  borderRadius: "5px",
}

function ClientList(props) {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const fieldID = props.fieldID;
  const add_shots_url = "http://127.0.0.1:8000/api/add_shots"
  const remove_user_url = "http://127.0.0.1:8000/api/remove_user_from_game"
  const access_token = (localStorage.getItem("accessToken") || "");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClientId, setCurrentClientId] = useState(-1);
  const [inputNumberValue, setInputNumberValue] = useState(1);
  const showModal = () => { setIsModalOpen(true); };
  const handleCancel = () => { setIsModalOpen(false); };
  const handleOk = () => {
    const shots = inputNumberValue;
    const userId = currentClientId
    const request_data = {
      quanity: shots,
      user: userId,
      game: fieldID
    }
    axios.post(add_shots_url, request_data, { headers }).then(response => {
      const data = response.data;
      if (data.message !== "Ok") {
        message.error(data.message)
      } else {
        const socket_message = {
          message: "added_user",
        }
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify(socket_message));
        } else {
          socketRef.current.onopen = function (event) {
            socketRef.current.send(JSON.stringify(socket_message));
          }
        }
      }
    }).catch(error => {
      if (error.message === "refresh failed") {
        navigate(error.loginUrl);
      } else {
        console.log(error);
      }
    })
    setIsModalOpen(false);
    setInputNumberValue(1);
    setCurrentClientId(-1);
  };

  const removeClientClicked = (id) => {
    const request_data = {
      user_id: id,
      game_id: fieldID
    }
    axios.post(remove_user_url, request_data, {headers}).then(response => {
      const data = response.data;
      if (data.message !== "Ok") {
        console.log(data);
        message.error(data.message);
      } else {
        message.success("Пользователь удален.");
        const socket_message = {
          message: "added_user",
        }
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify(socket_message));
        } else {
          socketRef.current.onopen = function (event) {
            socketRef.current.send(JSON.stringify(socket_message));
          }
        }
      }
    }).catch(error => {
      if (error.message === "refresh failed") {
        navigate(error.loginUrl);
      } else {
        console.log(error);
      }
    })
    // console.log(id);
  };


  useEffect(() => {
    socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + fieldID);
  }, [])

  return (
    <div>
      {(props.data.clients.length === 0) ? (<NoData text="Нет клиентов" />) : (
        <List itemLayout="horizontal" dataSource={props.data.clients} renderItem={(item, index) => (
          <List.Item actions={[<Popconfirm icon={<CloseCircleFilled style={{ color: "red" }} />} okButtonProps={{ danger: true }} onConfirm={() => removeClientClicked(item.id)} cancelText="Отменить" okText="Да, удалить" title="Удалить клиента?"><CloseOutlined /></Popconfirm>, <PlusSquareOutlined onClick={() => { setCurrentClientId(item.id); showModal(); }} />]}>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} style={icon} src={item.image_url} />}
              title={item.name}
              description={`Выстрелов: ${item.shots_number}`}
            />
          </List.Item>
        )} />
      )}
      <Modal title="Добавить выстрелы" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Добавить" cancelText="Отмена">
        <InputNumber addonBefore="+" defaultValue={1} min={1} value={inputNumberValue} onChange={(value) => setInputNumberValue(value)} />
      </Modal>
    </div>
  );
}

export default ClientList;