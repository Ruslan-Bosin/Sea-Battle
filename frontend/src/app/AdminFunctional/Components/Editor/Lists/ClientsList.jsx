import React from "react";
import { useState, useEffect, useRef } from "react";
import { List, Avatar, Modal, InputNumber } from "antd"
import { PlusSquareOutlined, UserOutlined } from "@ant-design/icons"
import axios from "axios"

// Styles
const icon = {
  backgroundColor: '#91caff',
  color: '#003eb3',
  borderRadius: "5px",
}

function ClientList(props) {

  /*
  Запрос POST (c token-ом)
  { fieldId, userId, addCount }
  -> { message }
  */
  const socketRef = useRef(null);
  const fieldID = props.fieldID;
  const add_shots_url = "http://127.0.0.1:8000/api/add_shots"
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
    const access_token = (localStorage.getItem("accessToken") || "");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token,
    }
    axios.post(add_shots_url, request_data, { headers }).then(response => {
      const data = response.data;
      if (data.message != "Ok") {
        console.log(data.message);
      } else {
        const socket_message = {
          message: "added_user",
        }
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify(socket_message));
          console.log("Message to server");
        }
      }
    })
    setIsModalOpen(false);
    setInputNumberValue(1);
    setCurrentClientId(-1);
  };


  useEffect(() => {
    socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + fieldID);
  }, [])

  const [clients_data, setClients_data] = useState([
    {
      id: "id1",
      name: 'Имя клииента',
      image_url: "",
      shots_number: 1
    },
    {
      id: "id2",
      name: 'Имя клииента',
      image_url: "",
      shots_number: 1
    },
    {
      id: "id3",
      name: 'Имя клииента',
      image_url: "",
      shots_number: 1
    },
    {
      id: "id4",
      name: 'Имя клииента',
      image_url: "",
      shots_number: 1
    },
  ]);

  // const user_info_url = "http://127.0.0.1:8000/api/get_users_from_game";
  // useEffect(() => {
  //   if (isModalOpen === false) {
  //     const access_token = (localStorage.getItem("accessToken") || "");
  //     const headers = {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + access_token,
  //     };
  //     const params = {
  //       'game': fieldID
  //     }
  //     axios.get(user_info_url, {params, headers})
  //     .then((response) => {
  //       const data = response.data;
  //       setClients_data(data);
  //       console.log(data);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  //   }

  //   }, [])
  return (
    <div>
      <List itemLayout="horizontal" dataSource={props.data.clients} renderItem={(item, index) => (
        <List.Item actions={[<PlusSquareOutlined onClick={() => { setCurrentClientId(item.id); showModal(); }} />]}>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} style={icon} src={item.image_url} />}
            title={item.name}
            description={`Выстрелов: ${item.shots_number}`}
          />
        </List.Item>
      )} />
      <Modal title="Добавить выстрелы" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Добавить" cancelText="Отмена">
        <InputNumber addonBefore="+" defaultValue={1} min={1} value={inputNumberValue} onChange={(value) => setInputNumberValue(value)} />
      </Modal>
    </div>
  );
}

export default ClientList;