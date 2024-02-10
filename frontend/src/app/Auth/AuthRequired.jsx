import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from 'axios';





function AuthRequired() {
  const [authorized, setAuthorized] = useState(true);
  useEffect (() => {
    // логика проверки пользователя
    if (localStorage.getItem("accessToken") === null) {
      setAuthorized(false);
    }
  }, []);
  return (
      authorized ? <Outlet/> : <Navigate to="/userauth/login"/>
  );
};

export default AuthRequired;
