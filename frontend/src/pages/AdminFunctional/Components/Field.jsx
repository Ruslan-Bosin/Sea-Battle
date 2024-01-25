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
  const editable = props.editable;
  const [fieldData, setFieldData] = useState({
    size: 5,
    placements: [
      {
        coordinate: 1,
        status: "empty"
      },
      {
        coordinate: 2,
        status: "empty"
      },
      {
        coordinate: 3,
        status: "empty"
      },
      {
        coordinate: 4,
        status: "empty"
      },
      {
        coordinate: 5,
        status: "empty"
      },
      {
        coordinate: 6,
        status: "empty"
      },
      {
        coordinate: 7,
        status: "empty"
      },
      {
        coordinate: 8,
        status: "empty"
      },
      {
        coordinate: 9,
        status: "empty"
      },
      {
        coordinate: 10,
        status: "empty"
      },
      {
        coordinate: 11,
        status: "empty"
      },
      {
        coordinate: 12,
        status: "empty"
      },
      {
        coordinate: 13,
        status: "unknown"
      },
      {
        coordinate: 14,
        status: "empty"
      },
      {
        coordinate: 15,
        status: "prize"
      },
      {
        coordinate: 16,
        status: "prize"
      },
    ]
  });

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
        <FieldCell status="in_game"/>
        <FieldCell status="empty"/>
        <FieldCell status="empty"/>
        <FieldCell status="win"/>
        <FieldCell status="empty"/>
        <FieldCell status="prize"/>
        <FieldCell status="untached"/>
        <FieldCell status="untached"/>
        <FieldCell status="missed"/>
        <FieldCell status="empty"/>
        <FieldCell status="win"/>
        <FieldCell status="prize"/>
        <FieldCell status="empty"/>
        <FieldCell status="empty"/>
        <FieldCell status="missed"/>
        <FieldCell status="missed"/>
        <FieldCell status="win"/>
        <FieldCell status="empty"/>
        <FieldCell status="prize" title="Название приза"/>
        <FieldCell status="empty"/>
        <FieldCell status="empty"/>
        <FieldCell status="empty"/>
        <FieldCell status="in_game"/>
        <FieldCell status="in_game"/>
        <FieldCell status="empty"/>

        
      </div>
    </div>
	);
}

export default Field;
