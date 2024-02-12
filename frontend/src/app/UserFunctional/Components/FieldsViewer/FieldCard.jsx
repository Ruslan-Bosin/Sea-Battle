import React, { useEffect, useState } from "react";
import { Card, Typography } from "antd";
import { GiftOutlined } from "@ant-design/icons"
import MiniField from "./MiniField";
import axios from "axios"


const { Title, Text } = Typography;

//Styles
const body_div = {
  maxWidth: "248px"
}
const card_body_style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "20px"
}
const title = {
  textAlign: "center",
  marginTop: "15px",
  marginBottom: 0
}
const text = {
  textAlign: "center",
  fontSize: "10px"
}

const additional_info = {
  background: "#F5F5F5FF",
  padding: "10px 5px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
  marginTop: "15px",
  borderRadius: "5px",
  fontSize: "10px"
}

const link = {
  color: "inherit",
  textDecoration: "inherit",
  cursor: "inherit"
}


function FieldCard(props) {

  const fieldId = props.fieldId;
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const game_info_url = "http://127.0.0.1:8000/api/get_cells_from_game";
  const [fieldData, setFieldData] = useState({
    size: 4,
    editable: true,
    FieldName: "test",
    Players: 0,
    GiftOut: 0,
    GiftMax: 0,
    placements: []
  })

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + fieldId);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message === "update_info" || data.message === "update_field") {
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
      'game': fieldId
    }
    axios.get(game_info_url, { params, headers })
      .then((response) => {
        const data = response.data;
        setFieldData(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [updateTrigger])


  return (
    <a style={link} href={"/user/game/" + fieldId}>
      <div style={body_div}>
        <Card hoverable bodyStyle={card_body_style}>
          <MiniField data={fieldData.placements} size={fieldData.size} editable={fieldData.editable} fieldID={fieldId} />
          <Title style={title} level={5} maxLength="2">{fieldData.FieldName}</Title>
          <Text type="secondary" style={text} > Осталось выстрелов: {fieldData.Shots} </Text>
          <div style={additional_info}>
            Осталось призов: {fieldData.GiftMax - fieldData.GiftOut} из {fieldData.GiftMax}<GiftOutlined />
          </div>
        </Card>
      </div>
    </a>
  );
}

export default FieldCard;
