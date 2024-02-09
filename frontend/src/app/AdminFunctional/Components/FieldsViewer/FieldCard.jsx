import React, {useState, useEffect} from "react";
import { Card, Typography } from "antd";
// import { Image } from "antd";
import { GiftOutlined } from "@ant-design/icons"
import MiniField from "./MiniField";
import axios from "axios";
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


function FieldCard(props) {
  const fieldId = props.FieldId
  console.log(fieldId);
  /*
  Запрос POST (c token-ом)
  { fieldId }
  -> (пример)
  {
      size: 4,
      editable: true,
      placements: [
        {
          coordinate: 1,
          status: "Empty"
        },
        {
          coordinate: 2,
          status: "Forbidden"
        },
        {
          coordinate: 3,
          status: "Empty"
        },
        {
          coordinate: 4,
          status: "Empty"
        },
        {
          coordinate: 5,
          status: "Forbidden"
        },
        {
          coordinate: 6,
          status: "Prize"
        },
        {
          coordinate: 7,
          status: "Forbidden"
        },
        {
          coordinate: 8,
          status: "Empty"
        },
        {
          coordinate: 9,
          status: "Prize"
        },
        {
          coordinate: 10,
          status: "Forbidden"
        },
        {
          coordinate: 11,
          status: "Empty"
        },
        {
          coordinate: 12,
          status: "Empty"
        },
        {
          coordinate: 13,
          status: "Empty"
        },
        {
          coordinate: 14,
          status: "Prize"
        },
        {
          coordinate: 15,
          status: "Prize"
        },
        {
          coordinate: 16,
          status: "Prize"
        },
      ]
    }
  */

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
    axios.get(game_info_url, {params, headers})
    .then((response) => {
      const data = response.data;
      setFieldData(data);
      console.log(data);
      console.log(fieldData);
    })
    .catch((error) => console.error('Error fetching data:', error));
    }, [updateTrigger])

  return (
    <div style={body_div}>
      <Card hoverable bodyStyle={card_body_style}>
        <MiniField placements={fieldData.placements} size={fieldData.size} editable={fieldData.editable}/>
        <Title style={title} level={5} maxLength="2">{ fieldData.FieldName }</Title>
        <Text type="secondary" style={text}>Количество игроков: { fieldData.Players }</Text>
        <div style={additional_info}>
          Выбито: {fieldData.GiftOut} из {fieldData.GiftMax}<GiftOutlined />
        </div>
      </Card>
    </div>
  );
}

export default FieldCard;
