import React, {useState, useEffect} from "react";
import { Outlet, Navigate } from "react-router-dom";
// import 

function UserMainPage() {
  // const [role, SetRole] = useState(null);
  const role = localStorage.getItem('role');
  // useEffect(() => {
  //   console.log(localStorage.getItem("role"));
  //   SetRole(localStorage.getItem("role"));
  // }, [])
  if (role === "user") {
    return <Outlet/>
  } else {
    return <Navigate to="/forbidden"/>
  }
}

export default UserMainPage;
