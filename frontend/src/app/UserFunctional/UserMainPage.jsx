import React from "react";
import { Outlet } from "react-router-dom";

function UserMainPage() {

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default UserMainPage;
