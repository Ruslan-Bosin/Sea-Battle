import React from "react";
import { GiftTwoTone } from "@ant-design/icons";

// Styles
const body_div = {
  background: "#F5F5F5FF",
  borderRadius: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px double #4096ff",
}

const prize_icon = {
  fontSize: "60%"
}

function PrizeMiniCell(props) {

  return (
    <div style={body_div}>
      <GiftTwoTone style={prize_icon} />
    </div>
  );
}

export default PrizeMiniCell;