import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

function AdminMainPage() {
  const role = localStorage.getItem('role');


  if (role === "admin") {
    return <Outlet/>
  } else {
    return <Navigate to="/forbidden"/>
  }


  // return (
  //   <div>
  //     {(<Outlet />) ? (role === "admin") : <Navigate to="/forbidden"/>}
  //     {/* <Outlet /> */}
  //   </div>
  // );
}

export default AdminMainPage;
