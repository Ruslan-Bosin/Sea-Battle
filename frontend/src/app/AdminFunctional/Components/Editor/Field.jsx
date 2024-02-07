import React from "react";
import { useState, useEffect } from "react";
import FieldCell from "./FieldCell";
import axios from "axios"

// Styles
const body_div = {
  background: "white",
  borderRadius: "20px",
  aspectRatio: "1 / 1",
  height: "100%",
  boxShadow: "0 0px 20px 3px rgba(0, 0, 0, 0.1)"
}

function Field(props) {
  /* Запрос через сокет (c token-ом)
  { fieldID }
  -> json как в fieldData и message */
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const fieldID = props.fieldID;
  const [fieldData, setFieldData] = useState(
    {
      size: 4,
      editable: true,
      placements: []
    }
  );

  const game_info_url = "http://127.0.0.1:8000/api/get_cells_from_game";

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + fieldID);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "update_field") {
        console.log('Message from server:', data);
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
      'game': fieldID
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

  // Styles with state
  const field_div = {
    padding: "2%",
    width: "96%",
    height: "96%",
    display: "grid",
    gridTemplateColumns: `repeat(${fieldData.size}, 1fr)`,
    gridTemplateRows: `repeat(${fieldData.size}, 1fr)`,
    gridGap: "1%"
  }

  return (
    <div style={body_div}>
      <div style={field_div}>
        {fieldData.placements.map(cell => {
          return <FieldCell fieldID={fieldID} coordinate={cell.coordinate} status={cell.status} key={cell.coordinate} />
        })}
      </div>
    </div>
  );
}

export default Field;
