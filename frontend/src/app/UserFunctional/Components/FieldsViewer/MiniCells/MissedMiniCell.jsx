import React from "react";
import { CloseOutlined } from "@ant-design/icons";

// Styles
const body_div = {
  background: "#F5F5F5FF",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const cross_icon = {
  fontSize: "60%",
  color: "#f5222d"
}

function MissedMiniCell(props) {

  return (
    <div style={body_div}>
      <CloseOutlined style={cross_icon} />
    </div>
  );
}

export default MissedMiniCell;