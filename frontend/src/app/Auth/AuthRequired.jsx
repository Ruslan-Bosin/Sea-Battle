import React from "react";
import { Navigate, Outlet } from "react-router-dom";

class AuthRequired extends React.Component {

    authorized = true;
    
    render() {
        return (
            this.authorized ? <Outlet/> : <Navigate to="userauth"/>
        );
    };
};

export default AuthRequired;
