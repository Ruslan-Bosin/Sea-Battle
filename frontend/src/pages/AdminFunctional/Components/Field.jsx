import React from "react";
import { useRef } from "react";


// Styles
const body_div = {
	background: "grey",
	aspectRatio: "1 / 1",
	width: "100%"
}

function Field() {

	const webSocket = useRef(null);
  webSocket.current = new WebSocket("ws://127.0.0.1:8000/ws/cell_update");

  const sendMessage = () => {
    console.log("BUHTA");
    if (webSocket.current.readyState === WebSocket.OPEN) {
      const message = {
        type: "test",
        message: "test_message"
      }
      webSocket.current.send(JSON.stringify(message));
      console.log("MESSAGE SENT");
    }
  };

	return (
		<div style={body_div}>
      <button onClick={sendMessage}>SEND</button>
		</div>
	);
}

export default Field;
