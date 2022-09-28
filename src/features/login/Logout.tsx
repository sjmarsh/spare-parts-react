import React, { useEffect } from "react";
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';

import { performLogout  } from './loginSlice';

export default function Logout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => logout());
    
    function logout() {
        console.log('logout');
        dispatch(performLogout());
        navigate('/');
    }

    return(
        <div>
            <p>Logout.</p>
        </div>
    )
}