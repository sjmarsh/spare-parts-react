import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectFilterGridState, updateFilterGridState, partSearch } from './partSearchSlice';

import FilterGrid from '../../components/filter/FilterGrid';
import FilterGridState from '../../components/filter/types/filterGridState';
import GraphQLRequest from '../../components/filter/types/graphQLRequest';
import Part from '../parts/types/Part';

export default function PartSearch() {

    const dispatch = useAppDispatch();

    const filterGridState = useAppSelector(selectFilterGridState);
    
    const handleOnFilterGridStateChanged = (filterGridState: FilterGridState<Part>) => {
        if(filterGridState){
            dispatch(updateFilterGridState(filterGridState));
        }
    }

    const handleTriggerServiceCall = (graphQLRequest: GraphQLRequest) => {
        dispatch(partSearch(graphQLRequest));
    }

    return(
        <div>
            <h1>Part Search</h1>
            <FilterGrid<Part> filterGridState={filterGridState} rootGraphQLField='parts' onFilterStateChanged={(filterGridState) => handleOnFilterGridStateChanged(filterGridState)} triggerServiceCall={(graphQLRequest) => handleTriggerServiceCall(graphQLRequest)}></FilterGrid>
        </div>
    )
}
