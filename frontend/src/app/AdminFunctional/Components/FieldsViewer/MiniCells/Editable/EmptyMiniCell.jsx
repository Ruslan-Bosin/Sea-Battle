import React from "react";
import { PlusOutlined, } from "@ant-design/icons";

// Styles
const body_div = {
  background: "#F5F5F5FF",
  borderRadius: "5px",
  padding: "5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const plus_icon = {
  fontSize: "50%"
}

function EmptyMiniCell(props) {


  return (
    <div style={body_div}>
      <PlusOutlined style={plus_icon} />
    </div>
  );
}

export default EmptyMiniCell;