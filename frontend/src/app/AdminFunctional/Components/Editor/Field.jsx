import React from "react";
import { useState } from "react";
import FieldCell from "./FieldCell";

// Styles
const body_div = {
  background: "white",
  borderRadius: "20px",
  aspectRatio: "1 / 1",
  height: "100%",
  boxShadow: "0 0px 20px 3px rgba(0, 0, 0, 0.1)"
}

function Field(props) {

  const fieldID = props.fieldID;

  const [fieldData, setFieldData] = useState(
    {
      size: 4,
      editable: true,
      placements: [
        {
          coordinate: 1,
          status: "Empty"
        },
        {
          coordinate: 2,
          status: "Empty"
        },
        {
          coordinate: 3,
          status: "Empty"
        },
        {
          coordinate: 4,
          status: "Empty"
        },
        {
          coordinate: 5,
          status: "Empty"
        },
        {
          coordinate: 6,
          status: "Prize"
        },
        {
          coordinate: 7,
          status: "Empty"
        },
        {
          coordinate: 8,
          status: "Empty"
        },
        {
          coordinate: 9,
          status: "Prize"
        },
        {
          coordinate: 10,
          status: "Empty"
        },
        {
          coordinate: 11,
          status: "Empty"
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
          status: "Prize"
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
          return <FieldCell fieldID={fieldID} coordinate={cell.coordinate} status={cell.status} key={cell.coordinate} />
        })}
      </div>
    </div>
  );
}

export default Field;
