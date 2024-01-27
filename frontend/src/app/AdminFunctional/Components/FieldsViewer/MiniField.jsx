import React from "react";
import { useState } from "react";
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

  const fieldID = props.fieldID;

  const [fieldData, setFieldData] = useState(
    {
      size: 4,
      editable: true,
      placements: [
        {
          coordinate: 1,
          status: "Missed"
        },
        {
          coordinate: 2,
          status: "Forbidden"
        },
        {
          coordinate: 3,
          status: "Empty"
        },
        {
          coordinate: 4,
          status: "Unwon"
        },
        {
          coordinate: 5,
          status: "Forbidden"
        },
        {
          coordinate: 6,
          status: "Won"
        },
        {
          coordinate: 7,
          status: "Forbidden"
        },
        {
          coordinate: 8,
          status: "Untouched"
        },
        {
          coordinate: 9,
          status: "Prize"
        },
        {
          coordinate: 10,
          status: "Forbidden"
        },
        {
          coordinate: 11,
          status: "Won"
        },
        {
          coordinate: 12,
          status: "Empty"
        },
        {
          coordinate: 13,
          status: "Empty"
        },
        {
          coordinate: 14,
          status: "Untouched"
        },
        {
          coordinate: 15,
          status: "Prize"
        },
        {
          coordinate: 16,
          status: "Prize"
        },
      ]
    }
  );

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