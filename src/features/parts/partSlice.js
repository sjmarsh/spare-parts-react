import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    parts: [
        { id: 1, name: 'part 1', weight: 2.3, dateStart: '2020-01-01' }
    ]
};

export const partSlice = createSlice({
    name: 'part',
    initialState,
    reducers: {
        addPart: (state, action) => {
            state.parts.push(action.payload);
            return state;
        },
        removePart:(state, action) => {
            return state.parts.filter(p => p.id !== action.payload.id);
        }
    }
});

export const selectParts = (state) => state.parts.parts;

export const {
    addPart,
    removePart
} = partSlice.actions;

export default partSlice.reducer;
