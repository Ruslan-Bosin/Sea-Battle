import React from "react";
import { GiftTwoTone } from "@ant-design/icons";

// Strles
const body_div = {
  background: "#F5F5F5FF",
  borderRadius: "5px",
  padding: "5px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px double #4096ff",
}

const prize_icon = {fontSize: "60%"}
function UnwonMiniCell(props) {

  return (
    <div style={body_div}>
      <GiftTwoTone style={prize_icon}/>
    </div>
  );
}

export default UnwonMiniCell;
