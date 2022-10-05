import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../api/client';

import config from '../../config.json';

import FetchStatus from '../../app/constants/fetchStatus';

export interface InventoryReportState {
    reportData: string,
    fetchStatus: FetchStatus,
    message?: string | null
};

const initialState: InventoryReportState = {
    reportData: '',
    fetchStatus: FetchStatus.Idle,
    message: null
};

const baseUrl: string = `${config.SERVER_URL}/api/inventory`;

export const fetchReport = createAsyncThunk<Blob, boolean>('inventoryReport/fetchReport', async (isCurrent: boolean) => {
    const response =  await client.getBlob(`${baseUrl}/report?isCurrentOnly=${isCurrent}`);
    return response.data;
});

export const inventoryReportSlice = createSlice({
    name: 'inventoryReport',
    initialState,
    reducers: {
        clearReport: (state) => {
            state.fetchStatus = FetchStatus.Idle,
            state.reportData = '',
            state.message = null
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchReport.pending, (state, action) => {
                state.fetchStatus = FetchStatus.Loading;
            })
            .addCase(fetchReport.fulfilled, (state, action) => {
                state.fetchStatus = FetchStatus.Succeeded;
                state.reportData = window.URL.createObjectURL(action.payload);
            })
            .addCase(fetchReport.rejected, (state, action) => {
                state.fetchStatus = FetchStatus.Failed;
                state.message = action.error.message;
            })
    }
});

export const {
    clearReport
} = inventoryReportSlice.actions;

export default inventoryReportSlice.reducer;