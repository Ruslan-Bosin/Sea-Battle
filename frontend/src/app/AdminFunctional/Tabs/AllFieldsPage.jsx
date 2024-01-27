import React from "react";
import Header from "../Components/Header/Header";
import NoFields from "../Components/FieldsViewer/NoFields";
import FieldCard from "../Components/FieldsViewer/FieldCard";

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

  /*
  Запрос GET (c token-ом)
  -> (пример) {
    fieldsNumber: 3,
    fields: [
      {
        id: 1,
        title: "BlaBlaBla",
        "usersCount": 0,
        "prizesWon": 0,
        "prizesCount": 0
      },
      {
        id: 34,
        title: "GGBET",
        "usersCount": 3,
        "prizesWon": 10,
        "prizesCount": 20
      },
      {
        id: 35,
        title: "SKLSJF",
        "usersCount": 23,
        "prizesWon": 99,
        "prizesCount": 100
      },
    ]
  }
  */

  const fieldsNumber = 1;

  return (
    <div style={body_div}>
      <Header selectedTab={2} showEditorTab={false}/>
      {(fieldsNumber === 0) ? (<NoFields/>) : (
        <div style={all_fields_block}>
          
          <FieldCard/>
          <FieldCard/>
          <FieldCard/>
          <FieldCard/>
          <FieldCard/>
          <FieldCard/>
          <FieldCard/>
          <FieldCard/>
          <FieldCard/>
          <FieldCard/>

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
