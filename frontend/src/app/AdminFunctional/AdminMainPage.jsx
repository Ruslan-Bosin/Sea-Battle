import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

function AdminMainPage() {
  const [role, SetRole] = useState(null);
  useEffect(() => {
    SetRole(localStorage.getItem("role"));
  })

  return (
    <div>
      {/* {(<Outlet/>) ? (role === "admin") : } */}
      <Outlet />
    </div>
  );
}

export default AdminMainPage;
