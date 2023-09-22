import FilterField from '../../../components/filter/types/filterField';
import { updateArrayItem } from '../arrayHelper';
import { describe, it, expect } from 'vitest';

describe('updateArrayItem', () => {

    it('should update array item', () => {
        
        const itemArray = new Array<FilterField>(
            { id: "1", name: "One", isSelected: true } as FilterField,
            { id: "2", name: "Two", isSelected: true } as FilterField
        );

        const itemToUpdate =  { id: "2", name: "Twoooo", isSelected: false } as FilterField

        const result = updateArrayItem(itemArray, itemToUpdate);
        expect(result).toHaveLength(2);
        const updatedItem = result.find(r => r.id === itemToUpdate.id);
        expect(updatedItem).to.deep.equal(itemToUpdate);
    })
    
})

