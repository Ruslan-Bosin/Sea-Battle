import React from "react";
import { Empty } from "antd";

// Styles
const empty = {
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
}

function NoFields() {
  return (
    <Empty description="Нет полей" image={Empty.PRESENTED_IMAGE_SIMPLE} style={empty} />
  );
}

export default NoFields;