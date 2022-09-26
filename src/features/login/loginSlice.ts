import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

import config from '../../config.json';

import AuthenticationRequest from "./types/AuthenticationRequest";
import AuthenticationResponse from './types/AuthenticationResponse';
import FetchStatus from '../../app/constants/fetchStatus';

const baseUrl = `${config.SERVER_URL}/api/user`;

export interface LoginState {
    loginDetails: AuthenticationRequest;
    authenticationResponse: AuthenticationResponse
    status: FetchStatus;
    error?: string | null
}

const initialState: LoginState = {
    loginDetails: {} as AuthenticationRequest,
    authenticationResponse: {} as AuthenticationResponse,
    status: FetchStatus.Idle,
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

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers:{
    },
    extraReducers(builder){
        builder
            .addCase(performLogin.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(performLogin.fulfilled, (state, action) => {
                state.status = FetchStatus.Succeeded;
                state.authenticationResponse = action.payload;
            })
            .addCase(performLogin.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
    }
});

export default loginSlice.reducer;