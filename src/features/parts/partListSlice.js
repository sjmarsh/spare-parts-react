import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import config from '../../config.json';

const initialState = {
    items: [],
    status: 'idle',
    error: null
};

const baseUrl = `${config.SERVER_URL}/api/part`;

export const fetchParts = createAsyncThunk('parts/fetchParts', async () => {
    const response =  await client.get(`${baseUrl}/index`);
    return response.data.items;  // todo - better handle actual response from api
})

export const deletePart = createAsyncThunk('parts/deletePart', async (partId) => {
    if(partId === 0) {
        return {};
    }
    const response = await client.delete(`${baseUrl}/?id=${partId}`);
    return response.data.value;
});


export const partListSlice = createSlice({
    name: 'partList',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(fetchParts.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchParts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                //state.items = state.items.concat(action.payload);
                state.items = action.payload;
            })
            .addCase(fetchParts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deletePart.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deletePart.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(deletePart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

    }
});

export const selectAllParts = (state) => state.parts.items;

/*
export const {
    // actions go here
} = partListSlice.actions;
*/

export default partListSlice.reducer;
