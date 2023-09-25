import FilterField from '../../../components/filter/types/filterField';
import FilterLine from '../../../components/filter/types/filterLine';
import { updateArrayItem, groupByKey, groupByFunc, Group } from '../arrayHelper';
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
  
    it('should group items by key', () => {
        const itemArray = new Array<FilterField>(
            { id: "1", name: "One", parentFieldName: "Parent1" } as FilterField,
            { id: "2", name: "Two", parentFieldName: "Parent1" } as FilterField,
            { id: "3", name: "Three", parentFieldName: "Parent2" } as FilterField
        );

        const result = groupByKey(itemArray, 'parentFieldName');
        
        expect(result).toHaveLength(2);
        expect(result[0].key).toBe("Parent1");
        expect(result[1].key).toBe("Parent2");
        expect(result[0].values).toContain(itemArray[0]);
        expect(result[0].values).toContain(itemArray[1]);
        expect(result[1].values).toContain(itemArray[2]);
    })

    it('shoul group items by func', () => {
        const itemArray = new Array<FilterLine> (
            { id: "1", selectedField: { id: "1", name: "One", parentFieldName: "Parent1" } } as FilterLine,
            { id: "2", selectedField: { id: "2", name: "Two", parentFieldName: "Parent1" } } as FilterLine,
            { id: "3", selectedField: { id: "3", name: "Three", parentFieldName: "Parent2" } } as FilterLine,
        )

        const result = groupByFunc<FilterLine>(itemArray, (item) => { return item.selectedField.parentFieldName ?? "" });

        expect(result).toHaveLength(2);
        expect(result[0].key).toBe("Parent1");
        expect(result[1].key).toBe("Parent2");
        expect(result[0].values).toContain(itemArray[0]);
        expect(result[0].values).toContain(itemArray[1]);
        expect(result[1].values).toContain(itemArray[2]);
    })

})

