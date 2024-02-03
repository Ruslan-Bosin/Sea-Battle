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

  const fieldID = props.fieldID;
  const [fieldData, setFieldData] = useState(
    {
      size: 4,
      placements: [
        {
          coordinate: 1,
          status: "Missed"
        },
        {
          coordinate: 2,
          status: "Unwon"
        },
        {
          coordinate: 3,
          status: "Unknown"
        },
        {
          coordinate: 4,
          status: "Unknown"
        },
        {
          coordinate: 5,
          status: "Missed"
        },
        {
          coordinate: 6,
          status: "Missed"
        },
        {
          coordinate: 7,
          status: "Unwon"
        },
        {
          coordinate: 8,
          status: "Unknown"
        },
        {
          coordinate: 9,
          status: "Won"
        },
        {
          coordinate: 10,
          status: "Unknown"
        },
        {
          coordinate: 11,
          status: "Unknown"
        },
        {
          coordinate: 12,
          status: "Unwon"
        },
        {
          coordinate: 13,
          status: "Unknown"
        },
        {
          coordinate: 14,
          status: "Unknown"
        },
        {
          coordinate: 15,
          status: "Unwon"
        },
        {
          coordinate: 16,
          status: "Unknown"
        },
      ]
    }
  );

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
    }, [])

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
