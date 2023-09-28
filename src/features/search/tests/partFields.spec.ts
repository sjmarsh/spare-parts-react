import { partFields } from '../partFields';
import { describe, it, expect } from 'vitest';

describe('partFields', () => {

    const fs = require("fs");
    const path = require("path");

    /* As we can't use Object.keys() on a typescript Interface to get field names this test is to make sure any updates to the Part interface are captured in partFields */
    it('should contain all part fields', () => {

        // read the contents of the Part.ts file 
        const partTsFilePath = path.join(__dirname, '../../parts/types/Part.ts');
        const partTsFileContent = fs.readFileSync(partTsFilePath, 'utf8');
        expect(partTsFileContent.length).toBeGreaterThan(0);
        
        // extract the field names from the file contents
        const regex = /\w+(?=.*:)/g;
        var expectedFields = [...partTsFileContent.matchAll(regex)].map(f => f[0]).filter(f => f !== "id" && f !== "attributes");
        expect(expectedFields.length).toBe(7);

        // read teh contents of the PartAttribute.ts file
        const partAttributesTsFilePath = path.join(__dirname, '../../parts/types/PartAttribute.ts');
        const partAttributesTsFileContent = fs.readFileSync(partAttributesTsFilePath, 'utf8');
        expect(partAttributesTsFileContent.length).toBeGreaterThan(0);
        var expectedAttributeFields = [...partAttributesTsFileContent.matchAll(regex)].map(f => f[0]).filter(f => f !== "id");
        expect(expectedAttributeFields.length).toBe(3);
        expectedFields = expectedFields.concat(expectedAttributeFields);

        // compare with the fields defined in partFields
        const actualFields = partFields().map(f => f.name);
        expect(actualFields).toHaveLength(10);
        expect(actualFields).toEqual(expectedFields);
    })

})