import React from "react";
import { Navigate } from "react-router-dom";

function Primary() {

  const isAdmin = true;

  if (isAdmin) {
    return (
      <Navigate to="/admin/allfields"/>
    );
  }

  return (
    <Navigate to=""/>
  );
};

export default Primary;