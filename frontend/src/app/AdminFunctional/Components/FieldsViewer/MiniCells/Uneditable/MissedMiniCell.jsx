import React from "react";
import { StopTwoTone } from "@ant-design/icons";

// Styles
const body_div = {
  background: "#F5F5F5FF",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px double rgb(255, 197, 61)",
}

const missed_icon = {
  fontSize: "60%"
}

function MissedMiniCell(props) {

  return (
    <div style={body_div}>
      <StopTwoTone twoToneColor="#ffc53d" style={missed_icon} />
    </div>
  );
}

export default MissedMiniCell;