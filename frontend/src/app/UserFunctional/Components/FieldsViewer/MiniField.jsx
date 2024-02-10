import React from "react";
import { useState, useEffect } from "react";
import MiniFieldCell from "./MiniFieldCell";
import axios from "axios"
// Styles
const body_div = {
  background: "white",
  borderRadius: "10px",
  aspectRatio: "1 / 1",
  height: "200px",
  border: "2px solid #F5F5F5FF"
}

function MiniField(props) {
  const fieldID = props.FieldId;
  const fieldData = {
      size: props.size,
      editable: props.editable,
      placements: props.data
    };

  // Styles with state
  const field_div = {
    padding: "2%",
    width: "96%",
    height: "96%",
    display: "grid",
    gridTemplateColumns: `repeat(${fieldData.size}, 1fr)`,
    gridTemplateRows: `repeat(${fieldData.size}, 1fr)`,
    gridGap: "1%"
  }

  return (
    <div style={body_div}>
      <div style={field_div}>
        {fieldData.placements.map(cell => {
          return <MiniFieldCell fieldID={fieldID} coordinate={cell.coordinate} status={cell.status} key={cell.coordinate} />
        })}
      </div>
    </div>
  );
}

export default MiniField;