import React, { useState, useEffect } from "react";

import { buildGraphQLRequest } from "./graphQLRequestBuilder";
import Chip from '../chips/types/chip';
import ChipColor from "../chips/types/chipColor";
import ChipList from '../chips/ChipList';
import ColumnHeader from "../datagrid/types/columnHeader";
import FilterGridState from "./types/filterGridState";
import FilterField from "./types/filterField";
import FilterLine from "./types/filterLine";
import { FilterOperator } from './types/filterOperators';
import FilterSelector from "./FilterSelector";
import GraphQLRequest from "./types/graphQLRequest";
import { PagedData } from "./types/pagedData";
import PageOffset from "./types/pageOffset";
import SimpleDataGrid from "../datagrid/simpleDataGrid";

import IconButton from "../buttons/IconButton";
import ButtonIcon from "../buttons/buttonIcon";
import { getUUid } from '../../app/helpers/uuidHelper';
import { randomInt } from "../../app/helpers/randomHelper";
import { updateArrayItem } from "../../app/helpers/arrayHelper";

import humanizeString from "humanize-string";

interface InputProps<T> {
    filterGridState : FilterGridState
    onFilterStateChanged?: (filterGridState: FilterGridState) => void | null;
    rootGraphQLField: string;
    serviceCall?: (graphQLRequest: GraphQLRequest) => Promise<PagedData<T>> | null;
}

const FilterGrid = <T,>(props: InputProps<T>) => {
    
    const [isFieldsSelectionVisible, setIsFieldSelectionVisible] = useState(true);
    const [isFilterEntryVisible, setIsFilterEntryVisible] = useState(true);
    const [filterLines, setFilterLines] = useState(props.filterGridState.filterLines);
    const [filterResults, setFilterResults] = useState(Array<T>);
    const [totalCount, setTotalCount] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setIsFieldSelectionVisible(props.filterGridState.isFieldsSelectionVisible);
    }, [props.filterGridState]);

    useEffect(() => {
        setIsFilterEntryVisible(props.filterGridState.isFiltersEntryVisible);
    }, [props.filterGridState]);

    /*
    useEffect(() => {
        if(filterLines.length > 0) {
            search();
        }
    },[filterLines]);
*/

    const MAX_FILTER_LINE_COUNT = 5;
    const PAGE_SIZE = 10;

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

    const getChipColor = (filterField: FilterField) : ChipColor => {
        if(!filterField.parentFieldName) {
            return ChipColor.Default;
        }
        const existingColor = props.filterGridState.chipColors.find(f => f.fieldId == filterField.id);
        if(existingColor) {
            return existingColor.chipColor;
        }

        const chipColors = Object.values(ChipColor);
        var color = chipColors[randomInt(chipColors.length)];
        props.filterGridState.chipColors.push({fieldId: filterField.id, chipColor: color});
        return color;
    }

    const getChipFields = () : Array<Chip> => {
        const chips = props.filterGridState.filterFields.map((f) => {
            const chip : Chip = { id: f.id, name: humanizeString(f.name), isActive: f.isSelected, color: getChipColor(f) }
            return chip;
        })
        return chips;
    }
    
    const handleToggleField = (chip: Chip) => {
        if(chip) {
            const isFilterSelected = props.filterGridState.filterLines.find(f => f.selectedField.id === chip.id);
            if(!isFilterSelected) {  // don't toggle chip if the filter is in use
                let itemToToggle = props.filterGridState.filterFields.find(f => f.id === chip.id);
                if(itemToToggle) {
                    const itemToUpdate = { ... itemToToggle };
                    itemToUpdate.isSelected = !itemToToggle.isSelected;
                    let state = { ... props.filterGridState };
                    state.filterFields = updateArrayItem<FilterField>(state.filterFields, itemToUpdate);                    
                    updateFilterGridState(state);
                }
            }
        }
    }

    const handleFilterLineChanged = (filterLine: FilterLine) => {        
        if(filterLines.find(f => f.id == filterLine.id)) {
            // update
            const state = updateArrayItem<FilterLine>(filterLines, filterLine);
            updateFilterGridState({ ... props.filterGridState, filterLines: state });
            setFilterLines(state);
        }
        else {
            // add
            const state = [ ... filterLines, filterLine ];
            updateFilterGridState({ ... props.filterGridState, filterLines: state });
            setFilterLines(state);
        }
    }

    const handleRemoveFilter = (filterLine: FilterLine) => {
        const state = filterLines.filter(f => f.id !== filterLine.id);
        updateFilterGridState({ ... props.filterGridState, filterLines: state });
        setFilterLines(state);
    }
    
    const addEmptyFilter = () => {
       if(filterLines.length < MAX_FILTER_LINE_COUNT) {
        const newLine = { id: getUUid(), selectedField: props.filterGridState.filterFields[0], selectedOperator: FilterOperator.Equal, value: '' } as FilterLine
        setFilterLines([...filterLines, newLine])
       }
    }

    const getNumberOfPages = (totalItemCount: number) => {
        if(totalItemCount > PAGE_SIZE) {
            var pageCount = totalItemCount / PAGE_SIZE;
            return Math.ceil(pageCount);
        }
        return 0;
    }
    
    const getColumnList = () : Array<ColumnHeader> => {
        return props.filterGridState.filterFields.filter(f => f.isSelected).map(f => { return { columnName: f.name, parentColumnName: f.parentFieldName} as ColumnHeader });
    }

    const search = () => {
        // TODO: validate filter lines
        const isValid = true;
        if(props.serviceCall && isValid){
            const pageOffset = { skip: props.filterGridState.currentResultPage * PAGE_SIZE - PAGE_SIZE, take: PAGE_SIZE } as PageOffset;
            const graphQLRequest = buildGraphQLRequest(filterLines, props.filterGridState.filterFields, props.rootGraphQLField, pageOffset);

            props.serviceCall(graphQLRequest)?.then((serviceResult) => {
                if(serviceResult && serviceResult.items && serviceResult.items.length > 0) {
                    setFilterResults(serviceResult.items);
                    setTotalCount(serviceResult.totalCount);
                    setNumberOfPages(getNumberOfPages(serviceResult.totalCount));
                    setHasError(false);
                    setErrorMessage("");
                } else {
                    const error = serviceResult.error ?? "No results found";
                    setHasError(true);
                    setErrorMessage(error);
                }
            }).catch((e) => {
                console.log(e);
                setHasError(true);
                setErrorMessage("No results found.");
            });
           
        } else {
            setHasError(true);
            setErrorMessage("Filter selections are invalid.");
            // TODO: expand on validation error.
        }
    }

    return(
        <div>
            <div>
            { props.filterGridState.filterFields &&
                <details open={isFieldsSelectionVisible} onToggle={e => handleFieldSelectionToggle()}>
                    <summary>Fields</summary>
                    <ChipList chips={getChipFields()} onToggleChip={chip => handleToggleField(chip)} ></ChipList>
                </details>
            }
            </div>
            
            <div className="mt-4">
            {
                filterLines && props.filterGridState.filterFields &&
                <details open={isFilterEntryVisible} onToggle={e => handleFilterEntryToggle()}>
                    <summary>Filters</summary>
                    <div className="card">
                        <div className="card-body">
                        { 
                            filterLines.map((line, index) => (
                                <FilterSelector key={index} fields={props.filterGridState.filterFields} filterLine={line} onFilterLineChanged={filterLine => handleFilterLineChanged(filterLine)} onRemoveFilter={filterLine => handleRemoveFilter(filterLine)} />
                            ))
                        }
                        <div className="mt-2">
                            <IconButton buttonTitle="Add Filter" buttonClassName="btn-outline-dark tool-button" onClick={addEmptyFilter} icon={ButtonIcon.Plus} iconClassName="tool-button-image" />
                            <IconButton buttonTitle="Search" buttonClassName="btn-outline-dark tool-button" onClick={search} icon={ButtonIcon.MagnifyingGlass} iconClassName="tool-button-image" />
                        </div>
                        </div>
                    </div>
                </details>
            }
            </div>

            {
                hasError && 
                <div className="alert alert-danger py-1">
                    <p>{errorMessage}</p>
                </div>
            }
            
            {
                filterResults && filterResults.length > 0 &&
                <div className="mt-6">
                    <SimpleDataGrid<T> dataSource={filterResults} columnList={getColumnList()} />
                </div>
            }
            

        </div>
    )
}

export default FilterGrid;