import React from "react";
import { useAppSelector } from '../app/hooks';

interface InputProps {
    roles?: Array<string> | null,
    children: JSX.Element
}

const Authorized = (props: InputProps) => {
    const isAuthenticated = useAppSelector(state => state.login.isAuthenticated);
    const userRoles = useAppSelector(state => state.login.roles);
    const intersectingRoles = userRoles?.filter(x => props.roles?.includes(x));
    const hasRequiredRoles = intersectingRoles && intersectingRoles.length > 0;
    
    return(
        <div>
            {isAuthenticated && hasRequiredRoles &&  
                <div>
                    {props.children}
                </div>
            }
        </div>
    );
};

export default Authorized;