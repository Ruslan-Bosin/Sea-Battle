import React from "react";
import { AimOutlined, } from "@ant-design/icons";

// Styles
const body_div = {
  background: "#F5F5F5FF",
  borderRadius: "5px",
  padding: "5px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const aim_icon = {
  fontSize: "50%"
}

function UnknownMiniCell(props) {

  return (
    <div style={body_div}>
      <AimOutlined style={aim_icon} />
    </div>
  );
}

export default UnknownMiniCell;