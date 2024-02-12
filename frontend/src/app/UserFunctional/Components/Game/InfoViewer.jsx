import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { UnorderedListOutlined, ShoppingOutlined, BookOutlined } from "@ant-design/icons";
import { Segmented, Card, Progress, Typography, Modal, Button } from "antd";
import AllPrizesList from "./Lists/AllPrizesList"
import MyPrizesList from "./Lists/MyPrizesList";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Markdown from 'react-markdown'


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
const two_sides = { display: "flex", justifyContent: "space-between", flexWrap: "wrap" }
const shoots_count = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#F5F5F5FF",
  borderRadius: "10px",
  padding: "10px",
  marginTop: "15px"
}

function InfoViewer(props) {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const fieldID = props.fieldID;
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const socketRef = useRef(null);

  const [data, setData] = useState({
    field_info: [],
    shoots_info: [],
    user_won: [],
    all_prizes: []
  });

  const get_shots_url = "http://127.0.0.1:8000/api/get_user_viewer/";

  useEffect(() => {
    socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + fieldID);
    socketRef.current.onmessage = (event) => {
      const data_from_socket = JSON.parse(event.data);
      if (data_from_socket.message === "update_info" || data_from_socket.message === "added_user" || data_from_socket.message === "update_field") {
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
      }
      // Обработайте сообщение от сервера по вашему усмотрению
    };
  }, [])

  useEffect(() => {
    const access_token = (localStorage.getItem("accessToken") || "");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token,
    };
    const params = {
      'game_id': props.fieldID,
    }
    axios.get(get_shots_url, { params, headers })
      .then((response) => {
        setData(response.data);

      })
      .catch(error => {
        if (error.message === "refresh failed") {
          navigate(error.loginUrl);
        } else {
          console.error("Error: ", error);
        }
      });
  }, [updateTrigger])

  const [tab, setTab] = useState("all");

  const showGuide = () => {
    modal.info({
      title: 'Инструкция',
      width: "50%",
      content: <div>
        <Markdown>
          Эта игра строится по **принципу** морского боя, за совершённые покупки на ваш аккаунт начисляются «выстрелы». На виртуальном поле находятся клетки: пустые и содержащие призы. Ваша задача выбрать клетку в которой находится приз, призы не могут стоять в соседних клетках. Дважды «стрелять» одну и ту же клетку запрещено. На поле находитесь не вы одни, поэтому поторопитесь, призы ограничены.
        </Markdown>
      </div>
    });
  }

  return (
    <div style={body_div}>

      <Card title="Поле" style={alert} extra={<Button onClick={showGuide}><BookOutlined /></Button>}>

        <div style={two_sides}>
          <Text>Название: </Text>
          <Text strong>{data.field_info.name}</Text>
        </div>

        <div style={two_sides}>
          <Text type="secondary">Принадлежит: </Text>
          <Text type="secondary" strong>{data.field_info.creator}</Text>
        </div>

        <div style={shoots_count}>
          <Text>Выстрелов: <Text keyboard>{data.shoots_info.quantity}</Text></Text>
        </div>

      </Card>

      <Card title="Статистика" style={alert}>
        <Progress style={progress} strokeColor="#52c41a" percent={Math.floor(data.user_won.length / data.all_prizes.length * 100)} status="active" />
        <Text type="secondary" style={progress_title}>Вы выиграли: {data.user_won.length}</Text>
        <Progress style={progress} percent={Math.floor(((data.unwon) / data.all_prizes.length) * 100)} status="active" />
        <Text type="secondary" style={progress_title}>Целых: {data.unwon}</Text>
      </Card>

      <Card title="Призы" style={alert}>
        <Segmented onChange={(value) => setTab(value)} block options={[{ label: 'Все', value: 'all', icon: <UnorderedListOutlined /> }, { label: 'Мои', value: 'mine', icon: <ShoppingOutlined /> },]} />
        {(tab === "all") ? <AllPrizesList all_prizes={data.all_prizes} /> : <MyPrizesList prizes={data.user_won} />}

      </Card>
      {contextHolder}

    </div>
  );
}

export default InfoViewer;