import React from "react";
import { LineOutlined } from "@ant-design/icons";

function UntouchedMiniCell(props) {

  // Styles with state
  const body_div = {
    background: "#F5F5F5FF",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  const missed_icon = {
    fontSize: "40%"
  }

  return (
    <div style={body_div}>
      <LineOutlined style={missed_icon} />
    </div>
  );
}

export default UntouchedMiniCell;
