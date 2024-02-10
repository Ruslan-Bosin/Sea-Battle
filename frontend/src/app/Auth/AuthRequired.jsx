import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from 'axios';


function AuthRequired() {
  const [authorized, setAuthorized] = useState(true);
  const api_url = "http://127.0.0.1:8000/api/token_check";
  const refresh_url = "http://127.0.0.1:8000/api/token/refresh/";
  useEffect (() => {
    const access_token = (localStorage.getItem("accessToken") || "");
    const refresh = (localStorage.getItem("refreshToken") || "")
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token,
    };
    axios.get(api_url, {headers}).then(response => {}).catch(error => {
      if (error.response.status === 401) {
        const request_data = {refresh: refresh};
        axios.post(refresh_url, request_data).then(response => {
          const response_data = response.data;
          const new_access = response_data.access;
          localStorage.setItem("accessToken", new_access);
        }).catch(error => {
          setAuthorized(false);
        })
      } else {
        setAuthorized(false);
      }
    })
  }, []);
  return (
      authorized ? <Outlet/> : <Navigate to="/userauth/login"/>
  );
};

export default AuthRequired;
