import React from "react";
import { Empty } from "antd";

// Styles
const empty = {
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px"
}

function NoData(props) {
  return (
    <Empty description={props.text} image={Empty.PRESENTED_IMAGE_SIMPLE} style={empty} />
  );
}

export default NoData;