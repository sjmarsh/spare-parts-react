import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import config from '../../config.json';

const initialState = {
    id: 0,
    value: {},
    mode: 'Closed',
    status: 'idle',
    error: null
};

const baseUrl = `${config.SERVER_URL}/api/part`;

export const fetchPart = createAsyncThunk('partDetail/fetchPart', async (partId) => {
    if(partId === 0) {
        return {};
    }
    const response = await client.get(`${baseUrl}/?id=${partId}`);
    return response.data.value;
});

export const createPart = createAsyncThunk('partDetail/createPart', async(part) => {
    if(!part) {
        console.log("can't create null part");
        return;
    }
    const response = await client.post(baseUrl, part);    
    return response.data.value;
});

export const updatePart = createAsyncThunk('partDetail/updatePart', async(part) => {
    if(!part) {
        console.log("can't update null part");
        return;
    }
    const response = await client.put(baseUrl, part);    
    return response.data.value;
});


export const partDetailSlice = createSlice({
    name: 'partDetail',
    initialState,
    reducers:{
        showDetail: (state, action) => {   
            state.mode = action.payload.detailMode;
            state.id = action.payload.selectedPartId;
            return state;
        }
    },
    extraReducers(builder){
        builder
            .addCase(fetchPart.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.value = action.payload;
            })
            .addCase(fetchPart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createPart.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(createPart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.value = action.payload;
            })
            .addCase(createPart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updatePart.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updatePart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.value = action.payload;
            })
            .addCase(updatePart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export const {
    showDetail
} = partDetailSlice.actions;

export default partDetailSlice.reducer;