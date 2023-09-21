import React, { useState, useEffect } from "react";

import Chip from '../chips/types/chip';
import ChipColor from "../chips/types/chipColor";
import ChipList from '../chips/ChipList';
import FilterGridState from "./types/filterGridState";

interface InputProps {
    filterGridState : FilterGridState
    onFilterStateChanged?: (filterGridState: FilterGridState) => void | null;
    rootGraphQLField? : string | null;
    // service call 
}

const FilterGrid = (props: InputProps) => {
    
    const [isFieldsSelectionVisible, setIsFieldSelectionVisible] = useState(true);
    const [isFilterEntryVisible, setIsFilterEntryVisible] = useState(true);

    useEffect(() => {
        setIsFieldSelectionVisible(props.filterGridState.isFieldsSelectionVisible);
    }, [props.filterGridState]);

    useEffect(() => {
        setIsFilterEntryVisible(props.filterGridState.isFiltersEntryVisible);
    }, [props.filterGridState]);

    const updateFilterGridState = (filterGridState: FilterGridState) => {
        if(props.onFilterStateChanged){
            props.onFilterStateChanged(filterGridState);
        }
    }

    let isStartUpFieldSelectionToggle = true;  // required to avoid infinite loop caused by delails element init behaviour
    const handleFieldSelectionToggle = () => {
        if(!isStartUpFieldSelectionToggle) {
            let state = { ... props.filterGridState };
            state.isFieldsSelectionVisible = !state.isFieldsSelectionVisible;  // TODO this is not the best. Better to add more granular reducers to the slice.
            updateFilterGridState(state);
        }
        isStartUpFieldSelectionToggle = false;
    }
    
    let isStartUpFilterEntryToggle = true;
    const handleFilterEntryToggle = () => {
        if(!isStartUpFilterEntryToggle) {
            let state = { ... props.filterGridState };
            state.isFiltersEntryVisible = !state.isFiltersEntryVisible;
            updateFilterGridState(state);
        }
        isStartUpFilterEntryToggle = false;
    }

    const getChipFields = () : Array<Chip> => {
        const chips = props.filterGridState.filterFields.map((f) => {
            const chip : Chip = { id: f.id, name: f.name, isActive: f.isSelected, color: ChipColor.Default }
            return chip;
        })
        return chips;
    }



    return(
        <div>
            <p>Filter Grid</p>
            <div>
                { props.filterGridState.filterFields &&
                    <details open={isFieldsSelectionVisible} onToggle={e => handleFieldSelectionToggle()}>
                        <summary>Fields</summary>
                        <ChipList chips={getChipFields()} ></ChipList>
                    </details>
                }
            </div>
            
            <div className="mt-4">
                {
                    props.filterGridState.filterLines && props.filterGridState.filterFields &&
                    <details open={isFilterEntryVisible} onToggle={e => handleFilterEntryToggle()}>
                        <summary>Filters</summary>
                        <p>Filter selector placeholder</p>
                    </details>
                }
            </div>

            <div className="alert alert-danger py-1">
            <p>Error message placeholder</p>
            </div>

            <div className="mt-6">
                <p>results placeholder</p>
            </div>

        </div>
    )
}

export default FilterGrid;