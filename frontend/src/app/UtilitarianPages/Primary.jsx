import React from "react";
import { Navigate } from "react-router-dom";

function Primary() {

  const isAdmin = false;
  
  if (isAdmin) {
    return (
      <Navigate to="/admin/allfields" />
    );
  } else {
    return (
      <Navigate to="/user/AvailableFields" />
    );
  }
};

export default Primary;
