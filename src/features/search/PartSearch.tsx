import React, {useState} from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectFilterGridState, updateFilterGridState, partSearch, selectPartSearchResult } from './partSearchSlice';

import FilterGrid from '../../components/filter/FilterGrid';
import FilterGridState from '../../components/filter/types/filterGridState';
import GraphQLRequest from '../../components/filter/types/graphQLRequest';
import Part from '../parts/types/Part';
import { PagedData } from '../../components/filter/types/pagedData';
import RequestStatus from '../../app/constants/requestStatus';

export default function PartSearch() {

    const dispatch = useAppDispatch();

    const filterGridState = useAppSelector(selectFilterGridState);
    const partSearchResult = useAppSelector(selectPartSearchResult);

    const handleOnFilterGridStateChanged = (filterGridState: FilterGridState) => {
        if(filterGridState){
            dispatch(updateFilterGridState(filterGridState));
        }
    }

    const handleServiceCall = async (graphQLRequest: GraphQLRequest) : Promise<PagedData<Part>> => {
        let result = {} as PagedData<Part>;
        await dispatch(partSearch(graphQLRequest)).then((res) => {
            if(res.meta.requestStatus === RequestStatus.Fulfilled && partSearchResult) {
                result = partSearchResult
            }
            else {
                result.error = 'An error occurred fetching search results.'
            }
        });
        
        return new Promise((resolve, reject) => {
            resolve(result);
            reject('an error occurred!!!');
        });
    }

    return(
        <div>
            <h1>Part Search</h1>
            <FilterGrid<Part> filterGridState={filterGridState} rootGraphQLField='parts' onFilterStateChanged={(filterGridState) => handleOnFilterGridStateChanged(filterGridState)} serviceCall={(g) => handleServiceCall(g)}></FilterGrid>
        </div>
    )
}
