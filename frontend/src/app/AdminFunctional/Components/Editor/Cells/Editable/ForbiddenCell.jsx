import React from "react";
import { useState } from "react";
import { CloseOutlined, } from "@ant-design/icons";
import { Tooltip } from "antd";

function ForbiddenCell(props) {

  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => { setIsHover(true); };
  const handleMouseLeave = () => { setIsHover(false); };

  // Styles with state
  const body_div = {
    background: (isHover ? "#F5F5F5FF" : "#f0f0f0"),
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  const plus_icon = {
    transform: (isHover ? "scale(1.2)" : "scale(1)"),
    transition: "all 0.2s ease-in-out",
    color: "#f5222d"
  }

  return (
    <Tooltip title="Поля вокруг приза нельзя редактировать">
      <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <CloseOutlined style={plus_icon} />
      </div>
    </Tooltip>
  );
}

export default ForbiddenCell;