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

const baseUrl = `${config.SERVER_URL}/api/inventory`;

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async (page) => {
    let skip = (page -1) * TableSettings.PageSize;
    const response =  await client.get(`${baseUrl}/index-detail?skip=${skip}&take=${TableSettings.PageSize}`);
    return response.data;  
})

export const inventorySlice = createSlice({
    name: "ivnentory",
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload      
        }
    },
    extraReducers(builder){
        builder
            .addCase(fetchInventory.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.status = FetchStatus.Succeeded;
                state.items = action.payload.items;
                state.totalItemCount = action.payload.totalItemCount;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
    }

});

export const selectPageOfInventory = (state) => state.inventory.items;

export const {
    setCurrentPage
} = inventorySlice.actions;

export default inventorySlice.reducer;

