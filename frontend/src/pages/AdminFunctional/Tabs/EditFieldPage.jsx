import React from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import Field from "../Components/Field";
import InfoViewer from "../Components/InfoViewer";

// Styles
const body_div = {
  postion: "absolute",
  width: "100vw",
  height: "100vh",
  background: "#F5F5F5FF",
  display: "flex",
  flexDirection: "column",
}

const edit_field_block = {
  flexGrow: 1, 
  padding: "1%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "2%",
  flexWrap: "wrap"
}

function EditFieldPage() {

  const params = useParams();
  const fieldID = params.fieldID;

  return (
    <div style={body_div}>
      <Header selectedTab={3} showEditorTab={true}/>
      <div style={edit_field_block}>
        <Field/>
        <InfoViewer/>
      </div>
      
    </div>
  );
}

export default EditFieldPage;


/*
<div style={{
  background: "red",
  width: "400px",
  height: "400px"
}}>

  <Field fieldID={fieldID}/>
</div>
*/