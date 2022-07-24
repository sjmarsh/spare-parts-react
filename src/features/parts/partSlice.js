import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    parts: [
        { id: 1, 
          name: 'Part 1', 
          description: 'The first one', 
          weight: 2.3, 
          price: 2.2, 
          startDate: '2020-01-01',
          endDate: '' }
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
        deletePart:(state, action) => {
            state.parts =  state.parts.filter(p => p.id !== action.payload);
            return state;
        }
    }
});

export const selectParts = (state) => state.parts.parts;

export const {
    addPart,
    deletePart
} = partSlice.actions;

export default partSlice.reducer;
