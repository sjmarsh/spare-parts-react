import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { RootState } from '../../app/store';

import config from '../../config.json';

import FilterGridState from '../../components/filter/types/filterGridState';
import FilterLine from '../../components/filter/types/filterLine';
import FieldChipColor from '../../components/filter/types/fieldChipColor';
import { FilterOperator } from '../../components/filter/types/filterOperators';
import { partFields } from './partFields';
import { getUUid } from '../../app/helpers/uuidHelper';
import GraphQLRequest from '../../components/filter/types/graphQLRequest';
import { PartGraphQLResponsePaged, PartGraphQLResponsePagedItems } from './types/partGraphQLResponse';
import FetchStatus from '../../app/constants/fetchStatus';
import Part from '../parts/types/Part';
import { PageInfo, PagedData } from '../../components/filter/types/pagedData';

export interface PartSearchState {
    filterGridState: FilterGridState<Part>
    status: FetchStatus
    error?: string | null
}

const initialState : PartSearchState = {
    filterGridState: {
        filterFields: partFields(),
        filterLines: new Array<FilterLine>( { id: getUUid(), selectedField: partFields()[0], selectedOperator: FilterOperator.Equal, value: '' } as FilterLine ),
        currentResultPage: 1,
        isFieldsSelectionVisible: true,
        isFiltersEntryVisible: true,
        filterResults: { items: new Array<Part>(), pageInfo: { hasNextPage: false } as PageInfo, totalCount: 0 } as PagedData<Part>
    } as FilterGridState<Part>,
    status: FetchStatus.Idle,
    error: null
}

export const partSearch = createAsyncThunk<PartGraphQLResponsePaged, GraphQLRequest>('/search/partSearch', async(graphQLRequest: GraphQLRequest) => {
    if(!graphQLRequest) {
        console.log("Can'te search without graphQLRequest");
        return;
    }
    const response = await client.post(`${config.SERVER_URL}/graphql`, graphQLRequest);
    return response.data;
})

export const partSearchSlice = createSlice({
    name: "partSearch",
    initialState,
    reducers: {
        updateFilterGridState: (state, action: PayloadAction<FilterGridState<Part>>) => {
            state.filterGridState = { ... action.payload };
            return state;
        }
    },  
    extraReducers(builder) {
        builder
            .addCase(partSearch.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(partSearch.fulfilled, (state, action: PayloadAction<PartGraphQLResponsePaged>) => {
                state.status = FetchStatus.Succeeded;
                const filterGridState = { ... state.filterGridState };
                filterGridState.filterResults = action.payload.data?.parts;
                state.filterGridState = { ... filterGridState };
            })
            .addCase(partSearch.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
    }
})

export const selectFilterGridState = (state: RootState) => state.partSearch.filterGridState;

export const { updateFilterGridState } = partSearchSlice.actions;

export default partSearchSlice.reducer;