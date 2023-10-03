import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { describe, test, expect } from 'vitest';

import FilterGrid from '../FilterGrid';
import FilterGridState from '../types/filterGridState';
import GraphQLRequest from '../types/graphQLRequest';
import FilterField from '../types/filterField';
import FilterFieldType from '../types/filterFieldType';
import FilterLine from '../types/filterLine';
import { FilterOperator } from '../types/filterOperators';
import { PageInfo, PagedData } from '../types/pagedData';

interface TestObject {
    name: string
    value: number
}

describe('filterGrid', () => {

    it('should render filter grid', () => {

        const filterFields = new Array<FilterField>(
            { id: '1', name: 'name', type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: '2', name: 'value', type: FilterFieldType.NumberType, isSelected: true } as FilterField
        );
        const filterLines = new Array<FilterLine>(
            { id: '1', selectedField: filterFields[0], selectedOperator: FilterOperator.Contains, value: 'The Value' } as FilterLine
        )
        const filterGridState = { filterFields: filterFields, filterLines, isFieldsSelectionVisible: true, isFiltersEntryVisible: true } as FilterGridState<TestObject>;
        const rootGraphQLField = "testObject";
        let handledStateChange: FilterGridState<TestObject> | null;
        const handleFilterStateChanged = (filterState: FilterGridState<TestObject>) => {
            handledStateChange = filterState;
        }
        let handledGraphQLRequest: GraphQLRequest | null;
        const handleTriggerServiceCall = (graphQLRequest: GraphQLRequest) => {
            handledGraphQLRequest = graphQLRequest;
        }

        render(
            <FilterGrid filterGridState={filterGridState} rootGraphQLField={rootGraphQLField} onFilterStateChanged={(filterState) => handleFilterStateChanged(filterState)} triggerServiceCall={(graphQLRequest) => handleTriggerServiceCall(graphQLRequest)} />
        )

        const fieldsHeader = screen.getByText('Fields');
        expect(fieldsHeader).toBeInTheDocument();
        const filtersHeader = screen.getByText('Filters');
        expect(filtersHeader).toBeInTheDocument();
        const options = screen.getAllByRole('option'); // should include chips and listbox options
        expect(options.length).toBe(9);
        expect(options.map(o => o.textContent)).toEqual(['Name', 'Value', 'Name', 'Value', 'Equal', 'Not equal', 'Contains', 'Starts with', 'Ends with'])
        const filterValue = screen.getByDisplayValue(filterLines[0].value);
        expect(filterValue).toBeInTheDocument();
    })

    it('should add filter', async () => {
        const user = userEvent.setup();
        const filterFields = new Array<FilterField>(
            { id: '1', name: 'name', type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: '2', name: 'value', type: FilterFieldType.NumberType, isSelected: true } as FilterField
        );
        const filterLines = new Array<FilterLine>(
            { id: '1', selectedField: filterFields[0], selectedOperator: FilterOperator.Contains, value: 'The Value' } as FilterLine
        )
        const filterGridState = { filterFields: filterFields, filterLines, isFieldsSelectionVisible: true, isFiltersEntryVisible: true } as FilterGridState<TestObject>;
        const rootGraphQLField = "testObject";
        let handledStateChange: FilterGridState<TestObject> | null = null;
        const handleFilterStateChanged = (filterState: FilterGridState<TestObject>) => {
            handledStateChange = filterState;
        }
        let handledGraphQLRequest: GraphQLRequest | null;
        const handleTriggerServiceCall = (graphQLRequest: GraphQLRequest) => {
            handledGraphQLRequest = graphQLRequest;
        }

        render(
            <FilterGrid filterGridState={filterGridState} rootGraphQLField={rootGraphQLField} onFilterStateChanged={handleFilterStateChanged} triggerServiceCall={handleTriggerServiceCall} />
        )

        let filterSelectionBoxes = screen.getAllByRole('combobox');
        expect(filterSelectionBoxes.length).toBe(2);
        const addFilterButton = screen.getByRole('button', {name: /Add Filter/i});
        expect(addFilterButton).toBeInTheDocument();

        await act(async () => {
            await userEvent.click(addFilterButton);
        })
        
        filterSelectionBoxes = screen.getAllByRole('combobox');
        expect(filterSelectionBoxes.length).toBe(4);
    })

    it('should remove filter', async () => {
        const user = userEvent.setup();
        const filterFields = new Array<FilterField>(
            { id: '1', name: 'name', type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: '2', name: 'value', type: FilterFieldType.NumberType, isSelected: true } as FilterField
        );
        const filterLines = new Array<FilterLine>(
            { id: '1', selectedField: filterFields[0], selectedOperator: FilterOperator.Contains, value: 'The Value' } as FilterLine,
            { id: '2', selectedField: filterFields[1], selectedOperator: FilterOperator.Contains, value: '22' } as FilterLine
        )
        const filterGridState = { filterFields: filterFields, filterLines, isFieldsSelectionVisible: true, isFiltersEntryVisible: true } as FilterGridState<TestObject>;
        const rootGraphQLField = "testObject";
        let handledStateChange: FilterGridState<TestObject> | null = null;
        let stateCount = 0; 
        const handleFilterStateChanged = (filterState: FilterGridState<TestObject>) => {
            stateCount += 1;
            handledStateChange = filterState;
        }
        let handledGraphQLRequest: GraphQLRequest | null;
        const handleTriggerServiceCall = (graphQLRequest: GraphQLRequest) => {
            handledGraphQLRequest = graphQLRequest;
        }

        render(
            <FilterGrid filterGridState={filterGridState} rootGraphQLField={rootGraphQLField} onFilterStateChanged={handleFilterStateChanged} triggerServiceCall={handleTriggerServiceCall} />
        )

        let filterSelectionBoxes = screen.getAllByRole('combobox');
        expect(filterSelectionBoxes.length).toBe(4);
        const removeFilterButtons = screen.getAllByRole('button', {name: /Remove Filter/i});
        expect(removeFilterButtons.length).toBe(2);
        const firstRemoveButton = removeFilterButtons[0];

        await act(async () => {
            await userEvent.click(firstRemoveButton);
        })
        
        expect(stateCount).toBe(1);
        expect(handledStateChange!.filterLines.length).toBe(1);
        filterSelectionBoxes = screen.getAllByRole('combobox');
        expect(filterSelectionBoxes.length).toBe(2);
    })

    it('should call service call on search', async () => {
        const user = userEvent.setup();
        const filterFields = new Array<FilterField>(
            { id: '1', name: 'name', type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: '2', name: 'value', type: FilterFieldType.NumberType, isSelected: true } as FilterField
        );
        const filterLines = new Array<FilterLine>(
            { id: '1', selectedField: filterFields[0], selectedOperator: FilterOperator.Contains, value: 'The Value' } as FilterLine
        )
        const filterGridState = { filterFields: filterFields, filterLines, isFieldsSelectionVisible: true, isFiltersEntryVisible: true } as FilterGridState<TestObject>;
        const rootGraphQLField = "testObject";
        let handledStateChange: FilterGridState<TestObject> | null = null;
        const handleFilterStateChanged = (filterState: FilterGridState<TestObject>) => {
        
            handledStateChange = filterState;
        }
        let handledGraphQLRequest: GraphQLRequest | null;
        const handleTriggerServiceCall = (graphQLRequest: GraphQLRequest) => {
            handledGraphQLRequest = graphQLRequest;
        }

        render(
            <FilterGrid filterGridState={filterGridState} rootGraphQLField={rootGraphQLField} onFilterStateChanged={handleFilterStateChanged} triggerServiceCall={handleTriggerServiceCall} />
        )

        const searchButton = screen.getByRole('button', {name: /Search/i});
        expect(searchButton).toBeInTheDocument();

        await act(async () => {
            await userEvent.click(searchButton);
            expect(handledGraphQLRequest).not.toBeNull();
            expect(handledGraphQLRequest?.query).toContain(rootGraphQLField);
        })
    })

    it('should render filter grid with results', () => {

        const filterFields = new Array<FilterField>(
            { id: '1', name: 'name', type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: '2', name: 'value', type: FilterFieldType.NumberType, isSelected: true } as FilterField
        );
        const filterLines = new Array<FilterLine>(
            { id: '1', selectedField: filterFields[0], selectedOperator: FilterOperator.Contains, value: 'The Value' } as FilterLine
        )
        const searchResults = {
            items: new Array<TestObject>({ name: 'The Value', value: 1 }),
            totalCount: 1,
            pageInfo: { hasNextPage: false } as PageInfo
        } as PagedData<TestObject>;

        const filterGridState = { filterFields: filterFields, filterLines, isFieldsSelectionVisible: true, isFiltersEntryVisible: true, filterResults: searchResults } as FilterGridState<TestObject>;
        const rootGraphQLField = "testObject";
        let handledStateChange: FilterGridState<TestObject> | null;
        const handleFilterStateChanged = (filterState: FilterGridState<TestObject>) => {
            handledStateChange = filterState;
        }
        let handledGraphQLRequest: GraphQLRequest | null;
        const handleTriggerServiceCall = (graphQLRequest: GraphQLRequest) => {
            handledGraphQLRequest = graphQLRequest;
        }

        render(
            <FilterGrid filterGridState={filterGridState} rootGraphQLField={rootGraphQLField} onFilterStateChanged={(filterState) => handleFilterStateChanged(filterState)} triggerServiceCall={(graphQLRequest) => handleTriggerServiceCall(graphQLRequest)} />
        )

        const columnHeaders = screen.getAllByRole('columnheader');
        expect(columnHeaders.length).toBe(3);
        expect(columnHeaders.map(c => c.textContent)).toEqual(['', 'Name', 'Value']);
        const cells = screen.getAllByRole('cell');
        expect(cells.length).toBe(3);
        expect(cells.map(c => c.textContent)).toEqual(['', 'The Value', '1.00']);
    })

})
