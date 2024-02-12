import React from "react";
import Header from "../Components/Header/Header";
import NoData from "../Components/FieldsViewer/NoData";
import FieldCard from "../Components/FieldsViewer/FieldCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Services/axios-config"


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
  const navigate = useNavigate()

  const created_by_admin_url = "http://127.0.0.1:8000/api/get_admin_created_games";
  const access_token = (localStorage.getItem("accessToken"));
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  };

  useEffect(() => {
    axios.get(created_by_admin_url, { headers })
      .then((response) => {
        const data = response.data
        setFieldsData(data);
      })
      .catch(error => {
        if (error.message === "refresh failed") {
          navigate(error.loginUrl);
        } else {
          console.log(error);
        }
      });
  }, []);

  const fieldsNumber = fieldsData.length;

  return (
    <div style={body_div}>
      <Header selectedTab={2} showEditorTab={false} />
      {(fieldsNumber === 0) ? (<NoData text={<p>У вас ещё нет полей<br /><a href="/admin/createfield" style={{ opacity: "50%" }}>Cоздать поле</a></p>} />) : (
        <div style={all_fields_block}>

          {fieldsData.map((field) => (
            <FieldCard
              key={field.id}
              FieldId={field.id}
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
