import React from "react";
import { GiftTwoTone } from "@ant-design/icons";

//Styles
const body_div = {
  background: "#F5F5F5FF",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px double rgb(255, 77, 79)",
}

const win_icon = {
  fontSize: "60%"
}

function UnwonMiniCell(props) {

  return (
    <div style={body_div}>
      <GiftTwoTone twoToneColor="#ff4d4f" style={win_icon} />
    </div>
  );

}

export default UnwonMiniCell;