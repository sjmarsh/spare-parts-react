import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { getTokenDetails } from '../../app/helpers/jwtHelper';

import config from '../../config.json';

import AuthenticationRequest from "./types/AuthenticationRequest";
import AuthenticationResponse from './types/AuthenticationResponse';
import FetchStatus from '../../app/constants/fetchStatus';

const baseUrl = `${config.SERVER_URL}/api/user`;

export interface LoginState {
    accessToken: string | null;
    isAuthenticated: boolean;
    roles: Array<string> | null;
    fetchStatus: FetchStatus;
    error?: string | null;
}

const initialState: LoginState = {
    accessToken: null,
    isAuthenticated: false,
    roles: null,
    fetchStatus: FetchStatus.Idle,
    error: null
}

export const performLogin = createAsyncThunk<AuthenticationResponse, AuthenticationRequest>('login/performLogin', async(authRequest: AuthenticationRequest) => {
    if(!authRequest) {
        console.log("can't login with null authentication details");
        return;
    }
    const response = await client.post(baseUrl + '/authenticate', authRequest);    
    return response.data;
});

export const performTokenRefresh = createAsyncThunk<AuthenticationResponse>('login/performTokenRefresh', async() => {
    const response = await client.post(baseUrl + '/refresh', '');
    return response.data;
});

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers:{
        performLogout: (state) => {
            state.error = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.roles = null;
        }
    },
    extraReducers(builder){
        builder
            .addCase(performLogin.pending, (state, action) => {
                state.fetchStatus = FetchStatus.Loading;
            })
            .addCase(performLogin.fulfilled, (state, action) => {
                state.fetchStatus = FetchStatus.Succeeded;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.roles = getTokenDetails(action.payload.accessToken).Roles;
            })
            .addCase(performLogin.rejected, (state, action) => {
                state.fetchStatus = FetchStatus.Failed;
                state.error = action.error.message;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.roles = null;
            })
            .addCase(performTokenRefresh.pending, (state, action) => {
                state.fetchStatus = FetchStatus.Loading;
            })
            .addCase(performTokenRefresh.fulfilled, (state, action) => {
                state.fetchStatus = FetchStatus.Succeeded;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.roles = getTokenDetails(action.payload.accessToken).Roles;
            })
            .addCase(performTokenRefresh.rejected, (state, action) => {
                state.fetchStatus = FetchStatus.Failed;
                state.error = action.error.message;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.roles = null;
            })
    }
});

export const { performLogout } = loginSlice.actions;

export default loginSlice.reducer;