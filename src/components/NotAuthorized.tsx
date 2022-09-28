import React from "react";
import { useAppSelector } from '../app/hooks';

interface InputProps {
    roles?: Array<string> | null,
    doRoleCheck?: boolean,
    children: JSX.Element | null
}

const NotAuthorized = ({roles = null, doRoleCheck = true, children = null}: InputProps) => {
    const isAuthenticated = useAppSelector(state => state.login.isAuthenticated);
    const userRoles = useAppSelector(state => state.login.roles);

    let isAuthorized : boolean = false;
    if(doRoleCheck) {    
        const intersectingRoles  = userRoles?.filter(x => roles?.includes(x));
        if(intersectingRoles && intersectingRoles.length > 0){
            isAuthorized = true;
        }
        else {
            isAuthorized = false;
        }        
    }
        
    return(
        <div>
            {!isAuthenticated && !isAuthorized &&  
                <div>
                    {children}
                </div>
            }
        </div>
    );
};

export default NotAuthorized;