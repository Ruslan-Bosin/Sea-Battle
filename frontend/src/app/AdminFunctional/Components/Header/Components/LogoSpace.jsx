import React from "react";

//Styles
const body_div = {
  margin: "8px",
  padding: "10px 50px",
  marginRight: "10px",
  background: "#F5F5F5FF",
  userSelect: "none",
  msUserSelect: "none",
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msTouchSelect: "none",
  fontSize: "70%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  color: "lightgrey",
  cursor: "arrow",
}

function LogoSpace() {

  return (
    <div style={body_div}>
      Logo Space
    </div>
  );
}

export default LogoSpace;