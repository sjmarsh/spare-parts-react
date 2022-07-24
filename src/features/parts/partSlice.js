import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const initialState = {
    items: [],
    status: 'idle',
    error: null
};

export const fetchParts = createAsyncThunk('parts/fetchParts', async () => {
    const response =  await client.get('https://localhost:7104/api/part/index');
    return response.data.items;  // todo - better handle actual response from api
})

export const partSlice = createSlice({
    name: 'part',
    initialState,
    reducers: {
        addPart: (state, action) => {
            state.items.push(action.payload);
            return state;
        },
        deletePart:(state, action) => {
            state.items =  state.items.filter(p => p.id !== action.payload);
            return state;
        }
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
    }
});

export const selectAllParts = (state) => state.parts.items;
export const selectPartById = (state, partId) => state.parts.items.find(p => p.id === partId);

export const {
    addPart,
    deletePart
} = partSlice.actions;

export default partSlice.reducer;
