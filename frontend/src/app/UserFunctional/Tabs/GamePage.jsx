import React from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header/Header";
import Field from "../Components/Game/Field"
import InfoViewer from "../Components/Game/InfoViewer";

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
  flexWrap: "wrap",
  overflowY: "scroll"
}

function GamePage() {

  const params = useParams();
  const fieldID = params.fieldID;

  return (
    <div style={body_div}>
      <Header selectedTab={2} showGameTab={true} />
      <div style={edit_field_block}>
        <Field fieldID={fieldID} />
        <InfoViewer fieldID={fieldID} />
      </div>
    </div>
  );
}

export default GamePage;
