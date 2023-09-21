import React, {useState} from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectFilterGridState, updateFilterGridState } from './partSearchSlice';


import FilterGrid from '../../components/filter/FilterGrid';
import FilterGridState from '../../components/filter/types/filterGridState';

export default function PartSearch() {

    const dispatch = useAppDispatch();

    const filterGridState = useAppSelector(selectFilterGridState);

    const handleOnFilterGridStateChanged = (filterGridState: FilterGridState) => {
        if(filterGridState){
            dispatch(updateFilterGridState(filterGridState));
        }
    }

    return(
        <div>
            <h1>Part Search</h1>
            <FilterGrid filterGridState={filterGridState} onFilterStateChanged={(filterGridState) => handleOnFilterGridStateChanged(filterGridState)}></FilterGrid>
        </div>
    )
}
