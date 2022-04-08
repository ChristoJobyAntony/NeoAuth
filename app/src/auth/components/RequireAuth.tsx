import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function RequireAuth (props : {children : JSX.Element}) {
    const auth = useAuth();
    if (!auth.token){
        return <Navigate to="/auth" />
    } 

    return props.children;
}

export default RequireAuth;