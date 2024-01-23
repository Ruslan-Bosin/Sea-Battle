import React from "react";
import Header from "../Components/Header";
import NoFields from "../Components/NoFields";
import FieldCard from "../Components/FieldCard";

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

  const fieldsNumber = 3;

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
