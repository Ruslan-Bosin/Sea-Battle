import React, { useEffect, useState } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import NotFound from '../UtilitarianPages/NotFound';
import UserLoginForm from '../../app/Auth/User/UserAuthForms/UserLoginForm'

const RoleRoute = ({allowedRole}) => {
  const [userRole, setUserRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const check_token_url = "http://127.0.0.1:8000/api/token_check";
  const refresh_token_url = "http://127.0.0.1:8000/api/token/refresh/";
  const get_role_url = "http://127.0.0.1:8000/api/get_user_role"
  
  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access,
    };
    const data = {
      "refresh": refresh
    };
    console.log(access);
    axios.get(check_token_url, {headers}).then(response => {setAuthenticated(true)}).catch(error => {
      axios.post(refresh_token_url, data).then(response => {
        localStorage.setItem("accessToken", response.data.access);
        setAuthenticated(true);
      })
    })
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("accessToken"),
    };
    axios.get(get_role_url, {headers}).then(response => {
      const data = response.data;
      if (data.role === "user") {
        setUserRole("user");
      } else if (data.role === "admin") {
        setUserRole("admin");
      }
    })
  }, []);

  if (!authenticated) {
    return <UserLoginForm />;

  }

  return userRole === allowedRole ? (
    <Outlet /> // Returning the original component
  ) : (
    <NotFound />
  );
};

export default RoleRoute;
