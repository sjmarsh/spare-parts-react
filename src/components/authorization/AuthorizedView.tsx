import React from "react";
import { useAppSelector } from '../../app/hooks';
import { userHasRequiredRoles } from './authrorizationHelper';
import AuthorizeProps from './types/AuthorizeProps';

const AuthorizedView = ({roles = null, doRoleCheck = true, children = null}: AuthorizeProps) => {
    
    const isAuthenticated = useAppSelector(state => state.login.isAuthenticated);
    const userRoles = useAppSelector(state => state.login.roles);

    let isAuthorized : boolean = true;
    if(doRoleCheck) {    
        isAuthorized = isAuthorized = userHasRequiredRoles(roles, userRoles);
    }
    
    return(
        <div>
            {isAuthenticated && isAuthorized &&  
                <div>
                    {children}
                </div>
            }
        </div>
    );
};

export default AuthorizedView;