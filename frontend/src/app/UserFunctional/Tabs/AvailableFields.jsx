import React, {useEffect, useState} from "react";
import Header from "../Components/Header/Header";
import NoFields from "../Components/FieldsViewer/NoFields";
import FieldCard from "../Components/FieldsViewer/FieldCard";
import axios from "../../Services/axios-config"
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
    axios.get(users_games_url, {headers})
      .then((response) => {
        const data = response.data;
        setFieldsData(data);
      })
      .catch(error => {
        if (error.message === "refresh failed") {
          navigate(error.loginUrl);
        } else {
          console.error("Error: ", error);
        }
      });
  }, [updateTrigger]);

    useEffect(() => {
      axios.get(get_user_url, { headers }).then(response => {
        const data = response.data;
        const user_id = data.id;
        const socket = new WebSocket('ws://127.0.0.1:8000/ws/user/new_game/' + user_id);
      
        socket.onmessage = (event) => {
          setUpdateTrigger(prevTrigger => prevTrigger + 1);
        };
      }).catch(error => {
        if (error.message === "refresh failed") {
          navigate(error.loginUrl);
        } else {
          console.error("Error: ", error);
        }
      })

  }, [])

  const fieldsNumber = fieldsData.length;

  return (
    <div style={body_div}>
      <Header selectedTab={1} showEditorTab={false} />
      {(fieldsNumber === 0) ? (<NoFields />) : (
        <div style={all_fields_block}>

          {fieldsData.map((field) => (
            <FieldCard
              key={field.id}
              fieldId={field.id} // Убедитесь, что каждая карточка имеет уникальный ключ// Замените на свои данные из API
              // FieldName={field.name}
              // Shots={field.shots_quantity} // Замените на свои данные из API
              // PrizesMax={field.prizes_max}
              // PrizesOut={field.prizes_out}
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
