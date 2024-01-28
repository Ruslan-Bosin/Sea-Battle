import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";

function HeaderTab(props) {

  const navigate = useNavigate();

  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  //Styles with State
  const body_div = {
    margin: "15px 8px",
    padding: "5px 2px",
    width: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "70%",
    background: (props.selected) ? (isHover ? "#69b1ff" : "#4096ff") : (isHover ? "#F5F5F5FF" : "#0505050F"),
    color: (props.selected) ? "white" : "black",
    userSelect: "none",
    msUserSelect: "none",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msTouchSelect: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }

  const clicked = () => {
    if (!props.selected) {
      if (props.tabIndex === 1) {
        navigate("/user/AvailableFields")
      }
    }
  }

  return (
    <Tooltip title={props.selected ? "Раздел уже открыт. При нажатии раздел обновится" : ""}>
      <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={clicked}>
        {props.title}
      </div>
    </Tooltip>
  );
}

export default HeaderTab;