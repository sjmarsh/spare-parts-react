import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { getTokenDetails, TokenDetails } from '../../app/helpers/jwtHelper';
import { LoginState, performTokenRefresh } from '../../features/login/loginSlice';

export const saveAccessToken : Middleware = api => next => action => {

    if(action.type === 'login/performLogin/fulfilled'){
        client.setAccessToken(action.payload.accessToken);
    }

    return next(action);
}

export const refreshAccessToken : Middleware = api => next => action => {

    if(action.type && action.type.startsWith('login/performTokenRefresh'))
        return next(action);

    const loginState : LoginState = api.getState().login;
    if(loginState.accessToken && !action.type.startsWith(performTokenRefresh.name)){
        const tokenDetails: TokenDetails = getTokenDetails(loginState.accessToken);
        if(tokenDetails.HasExpired) {           
            return api.dispatch<any>(performTokenRefresh())
                .then(next(action))
                .catch((err: any) => { console.log(err); });
        }
    }
    
    return next(action);
}