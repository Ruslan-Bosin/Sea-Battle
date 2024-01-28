import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function AuthRequired() {

  const authorized = true;

  return (
    authorized ? <Outlet /> : <Navigate to="/userauth/login" />
  );
};

export default AuthRequired;
