import React, { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import NoData from "../Components/FieldsViewer/NoData";
import FieldCard from "../Components/FieldsViewer/FieldCard";
import axios from "axios"

//Styles
const body_div = {
  postion: "absolute",
  width: "100vw",
  height: "100vh",
  background: "#F5F5F5FF",
  display: "flex",
  flexDirection: "column",
}

const all_fields_block = {
  flexGrow: 1,
  padding: "2%",
  display: "flex",
  flexWrap: "Wrap",
  justifyContent: "space-around",
  rowGap: "20px",
  overflowY: "scroll"
}

const space_fill = {
  width: "246px",
  height: "349.42px"
}

function AvailableFields() {
  const [fieldsData, setFieldsData] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const get_user_url = "http://127.0.0.1:8000/api/get_user";
  const users_games_url = "http://127.0.0.1:8000/api/get_user_games";
  const access_token = (localStorage.getItem("accessToken") || "nothing");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  };
  useEffect(() => {
    fetch(users_games_url, { headers })
      .then((response) => response.json())
      .then((data) => {
        setFieldsData(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [updateTrigger]);

  useEffect(() => {
    axios.get(get_user_url, { headers }).then(response => {
      const data = response.data;
      const user_id = data.id;
      const socket = new WebSocket('ws://127.0.0.1:8000/ws/user/new_game/' + user_id);

      socket.onmessage = (event) => {
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
      };
    })

  }, [])

  const fieldsNumber = fieldsData.length;

  return (
    <div style={body_div}>
      <Header selectedTab={1} showEditorTab={false} />
      {(fieldsNumber === 0) ? (<NoData text="Нет полей"/>) : (
        <div style={all_fields_block}>

          {fieldsData.map((field) => (
            <FieldCard
              key={field.id}
              fieldId={field.id}
            />
          ))}

          <div style={space_fill}></div>
          <div style={space_fill}></div>
          <div style={space_fill}></div>
          <div style={space_fill}></div>
          <div style={space_fill}></div>
        </div>
      )}
    </div>
  );
}


export default AvailableFields;
