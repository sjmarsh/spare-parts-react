import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { LoginState } from '../../features/login/loginSlice';

export const saveAccessToken : Middleware = api => next => action => {

    if(action.type === 'login/performLogin/fulfilled'){
        client.setAccessToken(action.payload.accessToken);
    }

    return next(action);
}

export const refreshAccessToken : Middleware = api => next => action => {

    const loginState : LoginState = api.getState().login;
    if(loginState && loginState.hasTokenExpired && !action.type.startsWith('login/performTokenRefresh')){
        console.log('refresh');
        const myAction: AnyAction = {
            extraProps: ['login/performTokenRefresh'],
            type: undefined
        }
        api.dispatch(myAction);
    }

    return next(action);
}