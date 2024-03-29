import React, { useState, useEffect } from "react";

import { buildGraphQLRequest } from "./graphQLRequestBuilder";
import Chip from '../chips/types/chip';
import ChipColor from "../chips/types/chipColor";
import ChipList from '../chips/ChipList';
import ColumnHeader from "../datagrid/types/columnHeader";
import FieldChipColor from "./types/fieldChipColor";
import FilterGridState from "./types/filterGridState";
import FilterField from "./types/filterField";
import FilterLine from "./types/filterLine";
import FilterLineSchema from "./types/filterLineSchema";
import { FilterOperator } from './types/filterOperators';
import FilterSelector from "./FilterSelector";
import GraphQLRequest from "./types/graphQLRequest";
import PageOffset from "./types/pageOffset";
import Pager from "../Pager";
import SimpleDataGrid from "../datagrid/simpleDataGrid";

import IconButton from "../buttons/IconButton";
import ButtonIcon from "../buttons/buttonIcon";
import { getUUid } from '../../app/helpers/uuidHelper';
import humanizeString from "humanize-string";
import { randomInt } from "../../app/helpers/randomHelper";
import { updateArrayItem } from "../../app/helpers/arrayHelper";
import { ValidationError } from "yup";



interface InputProps<T> {
    filterGridState : FilterGridState<T>
    onFilterStateChanged?: (filterGridState: FilterGridState<T>) => void | null;
    rootGraphQLField: string;
    triggerServiceCall?: (graphQLRequest: GraphQLRequest) => void | null;
}

const FilterGrid = <T,>(props: InputProps<T>) => {
    
    const [isFieldsSelectionVisible, setIsFieldSelectionVisible] = useState(true);
    const [isFilterEntryVisible, setIsFilterEntryVisible] = useState(true);
    const [chipColors, setChipColors] = useState(new Array<FieldChipColor>());
    const [filterLines, setFilterLines] = useState(props.filterGridState.filterLines);
    const [filterResults, setFilterResults] = useState(props.filterGridState.filterResults)
    const [filterFields, setFilterFields] = useState(props.filterGridState.filterFields);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setIsFieldSelectionVisible(props.filterGridState.isFieldsSelectionVisible);
    }, [props.filterGridState]);

    useEffect(() => {
        setIsFilterEntryVisible(props.filterGridState.isFiltersEntryVisible);
    }, [props.filterGridState]);

    useEffect(() => {
        setNumberOfPages(getNumberOfPages(props.filterGridState.filterResults?.totalCount ?? 0));
    }, [props.filterGridState]);

    useEffect(() => {
        setFilterResults(props.filterGridState.filterResults);
    }, [props.filterGridState.filterResults])


    const MAX_FILTER_LINE_COUNT = 5;
    const PAGE_SIZE = 10;

    const updateFilterGridState = (filterGridState: FilterGridState<T>) => {
        if(props.onFilterStateChanged) {
            return props.onFilterStateChanged(filterGridState);
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
        const existingColor = chipColors.find(f => f.parentName == filterField.parentFieldName);
        if(existingColor) {
            return existingColor.chipColor;
        }
        var colors = Object.values(ChipColor).filter(c => c !== ChipColor.Default);
        var color = colors[randomInt(colors.length)];
        setChipColors([... chipColors, { parentName: filterField.parentFieldName, chipColor: color}]);
        return color;
    }

    const getChipFields = () : Array<Chip> => {
        const chips = filterFields.map((f) => {
            const chip : Chip = { id: f.id, name: humanizeString(f.name), tooltip: humanizeString(f.parentFieldName ?? ""), isActive: f.isSelected, color: getChipColor(f) }
            return chip;
        })
        return chips;
    }
    
    const handleToggleField = (chip: Chip) => {
        if(chip) {
            const isFilterSelected = filterLines.find(f => f.selectedField.id === chip.id);
            if(!isFilterSelected) {  // don't toggle chip if the filter is in use
                let itemToToggle = filterFields.find(f => f.id === chip.id);
                if(itemToToggle) {
                    const itemToUpdate = { ... itemToToggle };
                    itemToUpdate.isSelected = !itemToToggle.isSelected;
                    let state = { ... props.filterGridState };
                    state.filterFields = updateArrayItem<FilterField>(state.filterFields, itemToUpdate);                    
                    updateFilterGridState(state);
                    setFilterFields(state.filterFields);
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
        const newLine = { id: getUUid(), selectedField: filterFields[0], selectedOperator: FilterOperator.Equal, value: '' } as FilterLine
        setFilterLines([...filterLines, newLine])
       }
    }

    const search = (currentPage?: number | null) => {
        setHasError(false);
        setErrorMessage("");                
        let validationErrors = "";
        filterLines.forEach(f => {
            try {
                FilterLineSchema.validateSync(f);
            } catch (e: any) {
                const validationError = e as ValidationError;
                if(validationError) {
                    validationErrors += validationError.message + '. ';
                } else {
                    console.log(`Unknown validation error: ${e}`);
                }
            }
        })
        const isValid = validationErrors.length === 0;
        
        if(props.triggerServiceCall && isValid){
            const currentResultPage = currentPage ?? props.filterGridState.currentResultPage;
            const pageOffset = { skip: currentResultPage * PAGE_SIZE - PAGE_SIZE, take: PAGE_SIZE } as PageOffset;
            const graphQLRequest = buildGraphQLRequest(filterLines, filterFields, props.rootGraphQLField, pageOffset);
            props.triggerServiceCall(graphQLRequest);
        } else {
            setHasError(true);
            setErrorMessage(`Filter selections are invalid. ${validationErrors}`);
        }
    }

    const getNumberOfPages = (totalItemCount: number) => {
        if(totalItemCount > PAGE_SIZE) {
            var pageCount = totalItemCount / PAGE_SIZE;
            return Math.ceil(pageCount);
        }
        return 0;
    }

    const handlePageClick = (pageNumber: number) => {
        updateFilterGridState({ ... props.filterGridState, currentResultPage: pageNumber });
        search(pageNumber);
    }
    
    const getColumnList = () : Array<ColumnHeader> => {
        return filterFields.filter(f => f.isSelected).map(f => { return { columnName: f.name, parentColumnName: f.parentFieldName} as ColumnHeader });
    }

    return(
        <div>
            <div>
            { filterFields &&
                <details open={isFieldsSelectionVisible} onToggle={e => handleFieldSelectionToggle()}>
                    <summary>Fields</summary>
                    <ChipList chips={getChipFields()} onToggleChip={chip => handleToggleField(chip)} ></ChipList>
                </details>
            }
            </div>
            
            <div className="mt-4">
            {
                filterLines && filterFields &&
                <details open={isFilterEntryVisible} onToggle={e => handleFilterEntryToggle()}>
                    <summary>Filters</summary>
                    <div className="card">
                        <div className="card-body">
                        { 
                            filterLines.map((line, index) => (
                                <FilterSelector key={index} fields={filterFields} filterLine={line} onFilterLineChanged={filterLine => handleFilterLineChanged(filterLine)} onRemoveFilter={filterLine => handleRemoveFilter(filterLine)} />
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
                <div className="mt-4">
                    <div className="alert alert-danger py-1">
                        <p>{errorMessage}</p>
                    </div>
                </div>
            }
            
            {
                filterResults && filterResults.items.length > 0 &&
                <div className="mt-6">
                    <SimpleDataGrid<T> dataSource={filterResults.items} columnList={getColumnList()} />
                </div>
            }
            {
                filterResults && numberOfPages > 0 && 
                <div>
                    <Pager currentPage={props.filterGridState.currentResultPage} pageSize={PAGE_SIZE} totalItemCount={filterResults.totalCount} onPageClick={pageNumber => handlePageClick(pageNumber)}></Pager>
                </div>
            }
            

        </div>
    )
}

export default FilterGrid;