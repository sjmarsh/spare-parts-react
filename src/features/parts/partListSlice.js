import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

import config from '../../config.json';

import FetchStatus from '../../app/constants/fetchStatus';
import TableSettings from '../../app/constants/tableSettings';

const initialState = {
    items: [],
    totalItemCount: 0,
    currentPage: 1,
    status: FetchStatus.Idle,
    error: null
};

const baseUrl = `${config.SERVER_URL}/api/part`;

export const fetchParts = createAsyncThunk('parts/fetchParts', async (page) => {
    let skip = (page -1) * TableSettings.PageSize;
    const response =  await client.get(`${baseUrl}/index?skip=${skip}&take=${TableSettings.PageSize}`);
    return response.data;  
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
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload      
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchParts.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(fetchParts.fulfilled, (state, action) => {
                state.status = FetchStatus.Succeeded;
                state.items = action.payload.items;
                state.totalItemCount = action.payload.totalItemCount;
            })
            .addCase(fetchParts.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
            .addCase(deletePart.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(deletePart.fulfilled, (state, action) => {
                state.status = FetchStatus.Succeeded;
            })
            .addCase(deletePart.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })

    }
});

export const selectPageOfParts = (state) => state.partsList.items;


export const {
    setCurrentPage
} = partListSlice.actions;


export default partListSlice.reducer;
