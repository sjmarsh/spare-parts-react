import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';

import SimpleDataGridDetailSection from '../simpleDataGridDetailSection';
import DataRowDetail from '../types/dataRowDetail';
import exp from 'constants';

describe('simpleDataGridDetailSection', () => {
    
    test('it should render detail section for given data', () => {
        
        const theData = new Array<Map<string, string>>(
            new Map<string, string>([['One', 'OneValue'], ['Two', 'TwoValue'], ['Three', 'ThreeValue']])    
        );
        const detailRows = new Array<DataRowDetail>(
            { detailHeader: 'The Detail', data: theData } as DataRowDetail
        );
        
        render(
            <SimpleDataGridDetailSection detailRows={detailRows} />
        );

        const detailHeader = screen.getByRole('heading', {level:6});
        expect(detailHeader).toBeInTheDocument();
        expect(detailHeader.textContent).toBe('The detail');
        
        const columnHeaders = screen.getAllByRole('columnheader');
        expect(columnHeaders.length).toBe(3);
        expect(columnHeaders.map(c => c.textContent)).toEqual(['One', 'Two', 'Three']);

        const cellValues = screen.getAllByRole('cell');
        expect(cellValues.length).toBe(3);
        expect(cellValues.map(c => c.textContent)).toEqual(['OneValue', 'TwoValue', 'ThreeValue']);        
    })
    
})