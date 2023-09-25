import React, {useState} from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectFilterGridState, updateFilterGridState } from './partSearchSlice';

import FilterGrid from '../../components/filter/FilterGrid';
import FilterGridState from '../../components/filter/types/filterGridState';
import GraphQLRequest from '../../components/filter/types/graphQLRequest';
import Part from '../parts/types/Part';
import { PagedData } from '../../components/filter/types/pagedData';

export default function PartSearch() {

    const dispatch = useAppDispatch();

    const filterGridState = useAppSelector(selectFilterGridState);

    const handleOnFilterGridStateChanged = (filterGridState: FilterGridState) => {
        if(filterGridState){
            dispatch(updateFilterGridState(filterGridState));
        }
    }

    const handleServiceCall = (graphQLRequest: GraphQLRequest) : PagedData<Part> => {
        console.log(graphQLRequest);
        const data = { items: new Array<Part>({ id: 1, name: "part 1", weight: 1, price: 1, startDate: '2020-01-01'} as Part, { id: 2, name: "part 2", weight: 2, price: 2, startDate: '2020-02-02'} as Part), pageInfo: { hasNextPage: false }, totalCount: 2 } as PagedData<Part>;
        return data;
    }

    return(
        <div>
            <h1>Part Search</h1>
            <FilterGrid<Part> filterGridState={filterGridState} rootGraphQLField='Parts' onFilterStateChanged={(filterGridState) => handleOnFilterGridStateChanged(filterGridState)} serviceCall={(g) => handleServiceCall(g)}></FilterGrid>
        </div>
    )
}
