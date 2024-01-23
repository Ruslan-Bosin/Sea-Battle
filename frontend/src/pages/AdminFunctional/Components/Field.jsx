import React from "react";
import { useEffect } from "react";
import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api/work_check";


// Styles
const body_div = {
	background: "grey",
	aspectRatio: "1 / 1",
	width: "100%"
}

function Field() {

	useEffect(() => {
		axios.get(baseURL).then((response) => {
		  console.log(response.data);
		});

    axios.post(baseURL, {
        title: "Hello World!",
        body: "This is a new post."
      }).then((response) => {
        console.log(response.data);
      });
	  }, []);

	return (
		<div style={body_div}>

		</div>
	);
}

export default Field;
