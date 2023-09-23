import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

import FilterGridState from '../../components/filter/types/filterGridState';
import FilterLine from '../../components/filter/types/filterLine';
import FieldChipColor from '../../components/filter/types/fieldChipColor';
import { FilterOperator } from '../../components/filter/types/filterOperators';
import { partFields } from './partFields';
import { getUUid } from '../../app/helpers/uuidHelper';

export interface PartSearchState {
    filterGridState: FilterGridState
}

const initialState : PartSearchState = {
    filterGridState: {
        filterFields: partFields(),
        filterLines: new Array<FilterLine>( { id: getUUid(), selectedField: partFields()[0], selectedOperator: FilterOperator.Equal, value: '' } as FilterLine ),
        currentResultPage: 1,
        isFieldsSelectionVisible: true,
        isFiltersEntryVisible: true,
        chipColors: new Array<FieldChipColor>
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