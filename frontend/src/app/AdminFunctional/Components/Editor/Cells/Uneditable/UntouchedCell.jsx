import React from "react";
import { useState } from "react";
import { LineOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

function UntouchedCell(props) {

  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {setIsHover(true);};
  const handleMouseLeave = () => {setIsHover(false);};

  // Styles with state
  const body_div = {
    background: (isHover ? "#F5F5F5FF" : "#0505050F"),
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  return (
    <Tooltip title="В это клетку ещё не стреляли">
      <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <LineOutlined />
      </div>
    </Tooltip>
  );
}

export default UntouchedCell;
