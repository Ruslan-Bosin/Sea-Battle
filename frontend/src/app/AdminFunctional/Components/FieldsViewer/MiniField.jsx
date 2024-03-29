import React from "react";
import MiniFieldCell from "./MiniFieldCell";

// Styles
const body_div = {
  background: "white",
  borderRadius: "10px",
  aspectRatio: "1 / 1",
  height: "200px",
  border: "2px solid #F5F5F5FF"
}

function MiniField(props) {
  // const fieldID = props.
  const fieldData = 
    {
      size: props.size,
      editable: props.editable,
      placements: props.placements
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
          return <MiniFieldCell coordinate={cell.coordinate} status={cell.status} key={cell.coordinate} />
        })}
      </div>
    </div>
  );
}

export default MiniField;