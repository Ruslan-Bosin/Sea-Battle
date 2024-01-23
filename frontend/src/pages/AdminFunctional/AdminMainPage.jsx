import React from "react";
import { Outlet } from "react-router-dom";

function AdminMainPage() {

  return (
    <div>
      <Outlet/>
    </div>
  );
}

export default AdminMainPage;