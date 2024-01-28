import React from "react";
import { useState, useEffect } from "react";
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

  const fieldID = props.fieldID;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClientId, setCurrentClientId] = useState(-1);
  const [inputNumberValue, setInputNumberValue] = useState(1);
  const showModal = () => { setIsModalOpen(true); };
  const handleCancel = () => { setIsModalOpen(false); };
  const handleOk = () => {
    console.log("ADD ");
    console.log(inputNumberValue);
    console.log("SHOOTS FOR USER WITH ID");
    console.log(currentClientId);
    setIsModalOpen(false);
    setInputNumberValue(1);
    setCurrentClientId(-1);
  };

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

  const user_info_url = "http://127.0.0.1:8000/api/get_users_from_game";
  useEffect(() => {
    const access_token = (localStorage.getItem("accessToken") || "");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token,
    };
    const params = {
      'game': fieldID
    }
    axios.get(user_info_url, {params, headers})
    .then((response) => {
      const data = response.data;
      setClients_data(data);
      console.log(data);
    })
    .catch((error) => console.error('Error fetching data:', error));
    }, [])
  return (
    <div>
      <List itemLayout="horizontal" dataSource={clients_data} renderItem={(item, index) => (
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