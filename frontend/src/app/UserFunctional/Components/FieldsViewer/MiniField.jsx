import React from "react";
import { useState, useEffect } from "react";
import MiniFieldCell from "./MiniFieldCell";
import axios from "axios"
// Styles
const body_div = {
  background: "white",
  borderRadius: "10px",
  aspectRatio: "1 / 1",
  height: "200px",
  border: "2px solid #F5F5F5FF"
}

function MiniField(props) {
  console.log(props);
  const fieldID = props.FieldId;
  console.log(fieldID)
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const [fieldData, setFieldData] = useState(
    {
      size: 4,
      editable: true,
      placements: [
        // {
        //   coordinate: 1,
        //   status: "Missed"
        // },
        // {
        //   coordinate: 2,
        //   status: "Unwon"
        // },
        // {
        //   coordinate: 3,
        //   status: "Unknown"
        // },
        // {
        //   coordinate: 4,
        //   status: "Unknown"
        // },
        // {
        //   coordinate: 5,
        //   status: "Missed"
        // },
        // {
        //   coordinate: 6,
        //   status: "Missed"
        // },
        // {
        //   coordinate: 7,
        //   status: "Unwon"
        // },
        // {
        //   coordinate: 8,
        //   status: "Unknown"
        // },
        // {
        //   coordinate: 9,
        //   status: "Won"
        // },
        // {
        //   coordinate: 10,
        //   status: "Unknown"
        // },
        // {
        //   coordinate: 11,
        //   status: "Unknown"
        // },
        // {
        //   coordinate: 12,
        //   status: "Unwon"
        // },
        // {
        //   coordinate: 13,
        //   status: "Unknown"
        // },
        // {
        //   coordinate: 14,
        //   status: "Unknown"
        // },
        // {
        //   coordinate: 15,
        //   status: "Unwon"
        // },
        // {
        //   coordinate: 16,
        //   status: "Unknown"
        // },
      ]
    }
  );

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + fieldID);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUpdateTrigger(prevTrigger => prevTrigger + 1);
      console.log('Message from server:', data);
      // Обработайте сообщение от сервера по вашему усмотрению
    };
  }, [])
  const game_info_url = "http://127.0.0.1:8000/api/get_cells_from_game";
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
          return <MiniFieldCell fieldID={fieldID} coordinate={cell.coordinate} status={cell.status} key={cell.coordinate} />
        })}
      </div>
    </div>
  );
}

export default MiniField;