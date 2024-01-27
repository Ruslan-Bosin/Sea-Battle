import React from "react";
import Header from "../Components/Header/Header";
import NoFields from "../Components/FieldsViewer/NoFields";
import FieldCard from "../Components/FieldsViewer/FieldCard";
import { useEffect, useState } from "react";


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

function AllFieldsPage() {
  const [fieldsData, setFieldsData] = useState([]);

  const created_by_admin_url = "http://127.0.0.1:8000/api/get_admin_created_games";
  const access_token = (localStorage.getItem("accessToken"));
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  };
  useEffect(() => {

    fetch(created_by_admin_url, {headers})
      .then((response) => response.json())
      .then((data) => setFieldsData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const fieldsNumber = fieldsData.length;

  return (
    <div style={body_div}>
      <Header selectedTab={2} showEditorTab={false}/>
      {(fieldsNumber === 0) ? (<NoFields/>) : (
        <div style={all_fields_block}>
          
          {fieldsData.map((field) => (
            <FieldCard
              key={field.id} // Убедитесь, что каждая карточка имеет уникальный ключ
              FieldName={field.name} // Замените на свои данные из API
              Players={field.players} // Замените на свои данные из API
              GiftOut={field.prizes_out} // Замените на свои данные из API
              GiftMax={field.prizes_max} // Замените на свои данные из API
            />
          ))}

          <div style={space_fill}></div>
          <div style={space_fill}></div>
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


export default AllFieldsPage;
