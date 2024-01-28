import React from "react";
import MiniFieldCell from "./MiniFieldCell"

// Styles
const body_div = {
  background: "white",
  borderRadius: "10px",
  aspectRatio: "1 / 1",
  height: "300px",
  border: "2px solid #F5F5F5FF"
}

function FieldSizePreview(props) {

  // Styles with state
  const field_div = {
    padding: "2%",
    width: "96%",
    height: "96%",
    display: "grid",
    gridTemplateColumns: `repeat(${props.size}, 1fr)`,
    gridTemplateRows: `repeat(${props.size}, 1fr)`,
    gridGap: "1%"
  }

  return (
    <div style={body_div}>
      <div style={field_div}>
        {Array.from(Array(props.size * props.size).keys()).map(element => {
          return <MiniFieldCell fieldID={"FieldSizePreview"} coordinate={element + 1} status={"Empty"} key={element + 1} />
        })}
      </div>
    </div>
  );
}

export default FieldSizePreview;