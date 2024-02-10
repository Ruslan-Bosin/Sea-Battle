import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Primary() {

  const navigate = useNavigate();

  useEffect(() => {
    const role = (localStorage.getItem("role") || "");
    if (role === "") {
      navigate("/userauth/login");
    } else if (role === "admin") {
      navigate("/admin/allfields");
    } else if (role === "user") {
      navigate("/user/availablefields");
    };
  }, []);

  /*
  if (role === "admin") {
    return (
      <Navigate to="/admin/allfields" />
    );
  } else {
    return (
      <Navigate to="/user/availablefields" />
    );
  }*/
  return <></>
};

export default Primary;
