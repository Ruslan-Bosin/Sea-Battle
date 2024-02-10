import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Alert, Card, Progress, Typography, Collapse, Button, Modal, Input, message } from "antd"
import ClientList from "./Lists/ClientsList";
import PrizesList from "./Lists/PrizesList";
import axios from "axios"

const { Text } = Typography;

// Styles
const body_div = {
  background: "white",
  minWidth: "250px",
  maxWidth: "400px",
  flexGrow: 1,
  height: "100%",
  boxShadow: "0 0px 30px 3px rgba(0, 0, 0, 0.05)",
  borderRadius: "20px",
  overflowY: "scroll"

}

const alert = { margin: "5%" };
const progress = { marginBottom: "0px" };
const progress_title = { fontSize: "10px" };
const button = { width: "90%", margin: "0% 5%", marginBottom: "5%" }

function InfoViewer(props) {

  /*
  Запрос через сокет (c token-ом)
  { fieldId }
  -> (пример) {
    editable: true,
    statistics: {
      shootsNumber: 2,
      missedCount: 1,
      prizesCount: 3,
      wonCount: 1,
      unwonCount: 2
    },
    clientsNumber: 1,
    clients: [
      {
        id: 123,
        name: "Abacaba",
        image: "https//asfasgasg.png"
        shootsCount: 3
      }
    ],
    prizesNumber: 1,
    prizes: [
      {
        id: 321,
        title: "Lamborgine",
        immage: "https//dbklajgjadg.png",
        won: flase
      }
    ]
  }


  Запрос POST (c token-ом)
  { fieldId, userEmail }
  -> { message } - добавление 
  */

  const socketRef = useRef(null);
  const [info, setInfo] = useState([]); // в info - данные в формате со строк 31 - 60
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const editable = true;
  const fieldID = props.fieldID;
  const add_user_url = "http://127.0.0.1:8000/api/add_user_to_game";
  const get_statistic = "http://127.0.0.1:8000/api/get_game_info_admin";
  const get_user_url = "http://127.0.0.1:8000/api/get_user";
  const params = {
    game: fieldID
  }
  const access_token = (localStorage.getItem("accessToken") || "");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const showModal = () => { setIsModalOpen(true); };
  const handleCancel = () => { setIsModalOpen(false); };
  const handleOk = () => {
    const email = inputValue;
    const response_data = {
      email: email,
      game: fieldID
    }
    axios.post(add_user_url, response_data, { headers }).then(response => {
      const data = response.data;
      if (data.message !== "Ok") {
        message.error("Неправильные данные пользователя");
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
        axios.get(get_user_url, { headers }).then(response => {
          const data = response.data;
          const user_id = data.id;
          const socket = new WebSocket('ws://127.0.0.1:8000/ws/user/new_game/' + user_id);
          socket.onopen = function (event) {
            const message_to_user_socket = {
              message: "new_game"
            }
            socket.send(JSON.stringify(message_to_user_socket));
          }
        })
      }
    })


    setIsModalOpen(false);
    setInputValue("");


  };

  const [data, setData] = useState({
    editable: true,
    statistics: {
      shootsNumber: 1,
      missedCount: 1,
      prizesCount: 1,
      wonCount: 1,
      unwonCount: 1,
      allCells: 2
    },
    clientsNumber: 1,
    clients: [
      {
        id: 123,
        name: "Abacaba",
        image: "https//asfasgasg.png",
        shootsCount: 3
      }
    ],
    prizesNumber: 1,
    prizes: [
      {
        id: 321,
        title: "Lamborgine",
        immage: "https//dbklajgjadg.png",
        won: false
      }
    ]
  });

  useEffect(() => {
    // const socket = new WebSocket('ws://127.0.0.1:8000/ws/cell_update' + fieldID);
    socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + fieldID);
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message === "update_info" || data.message === "added_user" || data.message === "update_field") {
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
      }
      // Обработайте сообщение от сервера по вашему усмотрению
    };
  }, [])

  useEffect(() => {
    axios.get(get_statistic, { headers, params }).then(response => {
      const data = response.data;
      setInfo(data);
      setData(data);
    })
  }, [updateTrigger])


  const collapse_items = [
    {
      key: '1',
      label: 'Пользователи',
      children: <ClientList fieldID={fieldID} data={data} />,
    },
    {
      key: '2',
      label: 'Призы',
      children: <PrizesList fieldID={fieldID} data={data} />,
    },
  ]

  return (
    <div style={body_div}>
      {data.editable ?
        <Alert style={alert} message="Редактируйте!" description="Вы можете редактировать это поле. Пока не было произведено абсолютно никаких выстрелов." type="success" showIcon /> :
        <Alert style={alert} message="Игра идёт..." description="Пользователи уже производили выстрелы по полю. Поле больше нельзя редактировать" type="warning" showIcon />}
      <Card title="Статистика" style={alert}>
        <Progress style={progress} strokeColor="#ffc53d" percent={Math.floor((data.statistics.missedCount * 100) / (data.statistics.allCells))} status="active" />
        <Text type="secondary" style={progress_title}>Промахов: {data.statistics.missedCount}</Text>
        <Progress style={progress} strokeColor="#ff4d4f" percent={(0) ? (data.statistics.prizesCount === 0) : Math.floor(((data.statistics.wonCount * 100) / (data.statistics.prizesCount)))} status="active" />
        <Text type="secondary" style={progress_title}>Выиграно: {data.statistics.wonCount}</Text>
        <Progress style={progress} percent={(0) ? (data.statistics.prizesCount === 0) : Math.floor(((data.statistics.unwonCount * 100) / (data.statistics.prizesCount)))} status="active" />
        <Text type="secondary" style={progress_title}>Осталось: {data.statistics.unwonCount}</Text>
      </Card>
      <Collapse style={alert} accordion items={collapse_items} />
      <Button style={button} type="dashed" onClick={showModal}>Добавить пользователя</Button>
      <Modal title="Добавление пользователя" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="Отмена" okText="Добавить на поле">
        <Input addonBefore="@" placeholder="Идентификатор пользователя" value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
      </Modal>
    </div>
  );
}

export default InfoViewer;