import React from "react";
import { useParams } from "react-router-dom";
import Field from "../Components/Field";

function EditFieldPage() {

  const params = useParams();
  const fieldID = params.fieldID;

  return (
    <div>
      ID = {fieldID}
      <div style={{
        background: "red",
        width: "400px",
        height: "400px"
      }}>
        <Field/>
      </div>
    </div>
  );
}

export default EditFieldPage;
