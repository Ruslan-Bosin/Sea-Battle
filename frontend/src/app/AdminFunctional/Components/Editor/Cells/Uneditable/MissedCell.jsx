import React from "react";
import { useState } from "react";
import { StopTwoTone } from "@ant-design/icons";
import { Tooltip } from "antd";

function MissedCell(props) {

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
    border: "thick double rgb(255, 197, 61)",
    boxShadow: (isHover ? "0 5px 15px rgba(255, 197, 61, 0.5)" : "0 5px 15px rgba(0,0,0,0)"),
    transition: "all 0.2s ease-in-out"
  }

  const missed_icon = {
    transform: (isHover ? "scale(2.5)" : "scale(2)"),
    transition: "all 0.2s ease-in-out"
  }

  return (
    <Tooltip title="Промах! В эту клетку стреляли">
      <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <StopTwoTone twoToneColor="#ffc53d" style={missed_icon}/>
      </div>
    </Tooltip>
  );
}

export default MissedCell;