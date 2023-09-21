import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

import FilterGridState from '../../components/filter/types/filterGridState';
import FilterField from '../../components/filter/types/filterField';
import FilterLine from '../../components/filter/types/filterLine';
import Part from '../parts/types/Part';
import PartCategory from '../parts/types/partCategory';

import { getUUid } from '../../app/helpers/uuidHelper';

export interface PartSearchState {
    filterGridState: FilterGridState
}

// using this to get keys as it is not possible from interface alone
const partInstance : Part = {
    id: 0,
    name: "",
    description: "",
    category: null,
    weight: 0,
    price: 0,
    startDate: '2020-01-01',
    endDate: null
}

const getFilterFields = () : Array<FilterField> => {
    const partKeys = Object.keys(partInstance);
    return partKeys.map((field) => { 
        return { id: getUUid(), name: field, type: typeof (partInstance), isSelected: false };
    });
}

const initialState : PartSearchState = {
    filterGridState: {
        filterFields: getFilterFields(),
        filterLines: new Array<FilterLine>,
        currentResultPage: 1,
        isFieldsSelectionVisible: true,
        isFiltersEntryVisible: true
    }
}

export const partSearchSlice = createSlice({
    name: "partSearch",
    initialState,
    reducers: {
        updateFilterGridState: (state, action: PayloadAction<FilterGridState>) => {
            state.filterGridState = { ... action.payload };
            return state;
        }
    },  
})

export const selectFilterGridState = (state: RootState) => state.partSearch.filterGridState;

export const { updateFilterGridState } = partSearchSlice.actions;

export default partSearchSlice.reducer;