import React, {useEffect} from "react";
import { useState } from "react";
import FieldCell from "./FieldCell";
import axios from "axios";

// Styles
const body_div = {
  background: "white",
  borderRadius: "20px",
  aspectRatio: "1 / 1",
  height: "100%",
  boxShadow: "0 0px 20px 3px rgba(0, 0, 0, 0.1)"
}

function Field(props) {
  const get_user_url = "http://127.0.0.1:8000/api/get_user"
  const fieldID = props.fieldID;
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [fieldData, setFieldData] = useState(
    {
      size: 4,
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
        //   status: "Untouched"
        // },
        // {
        //   coordinate: 4,
        //   status: "Untouched"
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
        //   status: "Untouched"
        // },
        // {
        //   coordinate: 9,
        //   status: "Won"
        // },
        // {
        //   coordinate: 10,
        //   status: "Untouched"
        // },
        // {
        //   coordinate: 11,
        //   status: "Untouched"
        // },
        // {
        //   coordinate: 12,
        //   status: "Unwon"
        // },
        // {
        //   coordinate: 13,
        //   status: "Untouched"
        // },
        // {
        //   coordinate: 14,
        //   status: "Untouched"
        // },
        // {
        //   coordinate: 15,
        //   status: "Unwon"
        // },
        // {
        //   coordinate: 16,
        //   status: "Untouched"
        // },
      ]
    }
  );
  
  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/cell_update/' + fieldID);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      const sender_id = data.sender_id;
      const access_token = (localStorage.getItem("accessToken") || "");
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,
      };
      axios.get(get_user_url, {headers}).then(response => {
        const response_data = response.data;
        if ((response_data.id !== sender_id) || (response_data.id === sender_id && data.message === "modal_closed")) {
          setUpdateTrigger(prevTrigger => prevTrigger + 1);
          console.log('This is sender');
        }
      })
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
