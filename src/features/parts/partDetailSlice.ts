import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../api/client';

import config from '../../config.json';

import Part from './types/Part';
import PartResponse from './types/PartResponse';
import ShowDetailPayload from './types/ShowDetailPayload';
import DetailMode from '../../app/constants/detailMode';
import FetchStatus from '../../app/constants/fetchStatus';
import PartAttribute from './types/PartAttribute';

export interface PartDetailState {
    id: number
    value: Part
    mode: DetailMode
    status: FetchStatus
    error?: string | null
}

const initialState : PartDetailState = {
    id: 0,
    value: { attributes: new Array<PartAttribute> } as Part,
    mode: DetailMode.Closed,
    status: FetchStatus.Idle,
    error: null
};

const baseUrl = `${config.SERVER_URL}/api/part`;

export const fetchPart = createAsyncThunk<PartResponse, number>('partDetail/fetchPart', async (partId: number) => {
    if(partId === 0) {
        const emptyPart: Part = { id: 0, name: "", description: "", category: null, weight: 0, price: 0, startDate: "", endDate: null };
        return { value: emptyPart, hasError: false, error: null } as PartResponse;
    }
    const response = await client.get(`${baseUrl}/?id=${partId}`);
    return response.data;
});

export const createPart = createAsyncThunk<PartResponse, Part>('partDetail/createPart', async(part: Part) => {
    if(!part) {
        console.log("can't create null part");
        return;
    }
    const response = await client.post(baseUrl, part);    
    return response.data;
});

export const updatePart = createAsyncThunk<PartResponse, Part>('partDetail/updatePart', async(part: Part) => {
    if(!part) {
        console.log("can't update null part");
        return;
    }
    const response = await client.put(baseUrl, part);    
    return response.data;
});


export const partDetailSlice = createSlice({
    name: 'partDetail',
    initialState,
    reducers:{
        showDetail: (state, action: PayloadAction<ShowDetailPayload>) => {   
            state.mode = action.payload.mode;
            state.id = action.payload.id;
            return state;
        }
    },
    extraReducers(builder){
        builder
            .addCase(fetchPart.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(fetchPart.fulfilled, (state, action: PayloadAction<PartResponse>) => {
                state.status = FetchStatus.Succeeded;
                state.value = action.payload.value;
            })
            .addCase(fetchPart.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
            .addCase(createPart.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(createPart.fulfilled, (state, action: PayloadAction<PartResponse>) => {
                state.status = FetchStatus.Succeeded;
                state.value = action.payload.value;
            })
            .addCase(createPart.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
            .addCase(updatePart.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(updatePart.fulfilled, (state, action: PayloadAction<PartResponse>) => {
                state.status = FetchStatus.Succeeded;
                state.value = action.payload.value;
            })
            .addCase(updatePart.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
    }
});

export const {
    showDetail
} = partDetailSlice.actions;

export default partDetailSlice.reducer;