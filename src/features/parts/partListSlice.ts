import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { RootState } from '../../app/store';

import config from '../../config.json';

import Part from './types/Part';
import PartListReponse from './types/PartListResponse';
import FetchStatus from '../../app/constants/fetchStatus';
import TableSettings from '../../app/constants/tableSettings';
import PartResponse from './types/PartResponse';

export interface PartListState {
    items: Array<Part>
    totalItemCount: number
    currentPage: number
    status: string
    hasError: boolean
    error?: string | null
}

const initialState : PartListState = {
    items: [],
    totalItemCount: 0,
    currentPage: 1,
    status: FetchStatus.Idle,
    hasError: false,
    error: null
};

const baseUrl: string = `${config.SERVER_URL}/api/part`;

export const fetchParts = createAsyncThunk<PartListReponse, number>('parts/fetchParts', async (page: number) => {
    let skip = (page -1) * TableSettings.PageSize;
    const response =  await client.get(`${baseUrl}/index?skip=${skip}&take=${TableSettings.PageSize}`);
    return response.data;  
})

export const deletePart = createAsyncThunk<PartResponse, number>('parts/deletePart', async (partId: number) => {
    if(partId === 0) {
        return {};
    }
    const response = await client.delete(`${baseUrl}/?id=${partId}`);
    return response.data;
});


export const partListSlice = createSlice({
    name: 'partList',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload      
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchParts.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(fetchParts.fulfilled, (state, action: PayloadAction<PartListReponse>) => {
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
                state.hasError = action.payload.hasError;
                state.error = action.payload.message;
            })
            .addCase(deletePart.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })

    }
});

export const selectPageOfParts = (state: RootState) => state.partsList.items;


export const {
    setCurrentPage
} = partListSlice.actions;


export default partListSlice.reducer;
