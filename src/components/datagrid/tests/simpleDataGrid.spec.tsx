import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';

import SimpleDataGrid from '../simpleDataGrid';
import ColumnHeader from '../types/columnHeader';

interface TestDetailObject {
    description: string,
    quantity: number
}

interface TestObject {
    name: string,
    value: number,
    details?: Array<TestDetailObject> | null
}

describe('simpleDataGrid', () => {

    test('it should render data', () => {
        const dataSource = new Array<TestObject>(
            { name: 'One', value: 1 },
            { name: 'Two', value: 2 }
        );
        const columns = new Array<ColumnHeader>(
            { columnName: 'name' },
            { columnName: 'value' }
        )

        render(
            <SimpleDataGrid dataSource={dataSource} columnList={columns} /> 
        )

        const theTable = screen.getByRole('table');
        expect(theTable).toBeInTheDocument();
        const columnHeaders = screen.getAllByRole('columnheader');
        expect(columnHeaders.length).toBe(3);
        expect(columnHeaders.map(c => c.textContent)).toEqual(['', 'Name', 'Value']);
        const cellValues = screen.getAllByRole('cell');
        expect(cellValues.length).toBe(6);
        expect(cellValues.map(c => c.textContent)).toEqual(['', 'One', '1.00', '', 'Two', '2.00']);
    })

    test('it should not render column if not in columnList', () => {
        const dataSource = new Array<TestObject>(
            { name: 'One', value: 1 },
            { name: 'Two', value: 2 }
        );
        const columns = new Array<ColumnHeader>(
            { columnName: 'name' } // does not include the value column  
        )

        render(
            <SimpleDataGrid dataSource={dataSource} columnList={columns} /> 
        )

        const theTable = screen.getByRole('table');
        expect(theTable).toBeInTheDocument();
        const columnHeaders = screen.getAllByRole('columnheader');
        expect(columnHeaders.length).toBe(2);
        expect(columnHeaders.map(c => c.textContent)).toEqual(['', 'Name']);
        const cellValues = screen.getAllByRole('cell');
        expect(cellValues.length).toBe(4);
        expect(cellValues.map(c => c.textContent)).toEqual(['', 'One', '', 'Two']);
    })

    test('it should show and hide details', async () => {
        const user = userEvent.setup();
        const dataSource = new Array<TestObject>(
            { name: 'One', value: 1, details: new Array<TestDetailObject>({description: 'The One', quantity: 11}) },
            { name: 'Two', value: 2, details: new Array<TestDetailObject>({description: 'The Two', quantity: 22}) }
        );
        const columns = new Array<ColumnHeader>(
            { columnName: 'name' },
            { columnName: 'value' },
            { columnName: 'description' },
            { columnName: 'quantity' },
        )

        render(
            <SimpleDataGrid dataSource={dataSource} columnList={columns} /> 
        )

        const theParentTable = screen.getByRole('table');
        expect(theParentTable).toBeInTheDocument();
        let theDetailHeaders = screen.queryAllByText('Details');
        expect(theDetailHeaders.length).toBe(0);
        let detailButtons = screen.getAllByRole('button');
        expect(detailButtons.length).toBe(2);
        await user.click(detailButtons[0]);
        theDetailHeaders = screen.queryAllByText('Details');
        expect(theDetailHeaders.length).toBe(1);
        detailButtons = screen.getAllByRole('button');
        await user.click(detailButtons[1]);
        theDetailHeaders = screen.queryAllByText('Details');
        expect(theDetailHeaders.length).toBe(2);
        detailButtons = screen.getAllByRole('button');
        await user.click(detailButtons[0]);
        theDetailHeaders = screen.queryAllByText('Details');
        expect(theDetailHeaders.length).toBe(1);
    })

})