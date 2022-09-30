import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from '../../app/hooks';
import AuthorizeProps from "./types/AuthorizeProps";
import { userHasRequiredRoles } from './authrorizationHelper';

const AuthrorizedRoute = ({roles = null, doRoleCheck = true, children = null}: AuthorizeProps) => {
    const isAuthenticated = useAppSelector(state => state.login.isAuthenticated);
    const userRoles = useAppSelector(state => state.login.roles);

    let isAuthorized : boolean = true;
    if(doRoleCheck) {    
        isAuthorized = userHasRequiredRoles(roles, userRoles);
    }

    if(isAuthenticated && isAuthorized) {
        return children;
    }

    return <Navigate to={'/'} />
}

export default AuthrorizedRoute;