import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../api/client';

import config from '../../config.json';

import FetchStatus from '../../app/constants/fetchStatus';

export interface PartReportState {
    reportData: string,
    fetchStatus: FetchStatus,
    message?: string | null
};

const initialState: PartReportState = {
    reportData: '',
    fetchStatus: FetchStatus.Idle,
    message: null
};

const baseUrl: string = `${config.SERVER_URL}/api/part`;

export const fetchReport = createAsyncThunk<any>('partReport/fetchReport', async () => {
    const response =  await client.getBlob(`${baseUrl}/report`);
    return response.data;
});

export const partReportSlice = createSlice({
    name: 'partReport',
    initialState,
    reducers: {
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

export default partReportSlice.reducer;