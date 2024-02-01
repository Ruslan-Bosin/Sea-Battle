import React from "react";
import { GiftTwoTone } from "@ant-design/icons";

//Styles
const body_div = {
  background: "#F5F5F5FF",
  borderRadius: "5px",
  padding: "5px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px double rgb(82,196,26)",
}

const win_icon = {
  fontSize: "60%"
}


function WonMiniCell(props) {

  return (
    <div style={body_div}>
      <GiftTwoTone twoToneColor="#52c41a" style={win_icon} />
    </div>
  );

}

export default WonMiniCell;