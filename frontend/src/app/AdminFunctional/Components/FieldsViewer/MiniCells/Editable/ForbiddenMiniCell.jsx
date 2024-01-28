import React from "react";
import { CloseOutlined, } from "@ant-design/icons";

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

const plus_icon = {
  fontSize: "50%",
  color: "#f5222d"
}

function ForbiddenMiniCell(props) {

  return (
    <div style={body_div}>
      <CloseOutlined style={plus_icon} />
    </div>
  );
}

export default ForbiddenMiniCell;