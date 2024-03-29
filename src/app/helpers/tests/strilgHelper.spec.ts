import { camelize, getFormattedDate, getFormattedNumber, getFormattedValue } from '../stringHelper';
import { describe, it, expect } from 'vitest';

describe('camelize', () => {
        
    const cases = [
        ['t', 't'], 
        ['the', 'the'], 
        ['The', 'the'], 
        [' the', 'the'], 
        ['the ', 'the'],
        ['ABC', 'aBC'],  
        ['theString', 'theString'],
        ['the string', 'theString'],
        ['The string', 'theString'],
        ['The String', 'theString'],
        ['The String123', 'theString123'],
        ['THE STRING', 'theString'],
        ['THE_String', 'theString'],
        ['THE-String', 'theString'],
        ['THE-String is_BIG', 'theStringIsBig'],
    ]

    test.each(cases)("it should convert %s to %s",(input, expectedResult) => {
        const actualResult = camelize(input);
        expect(actualResult).toBe(expectedResult);
    });
    
});

describe('getFormattedDate', () => {
    
    it('should return null when input is null', () => {   
        const actualResult = getFormattedDate(null);
        expect(actualResult).toBeNull(); 
    });

    it('should return null when input is invalid date string', () => {   
        const actualResult = getFormattedDate("notADate 12");
        expect(actualResult).toBeNull(); 
    });

    it('should return null when input is a boolean', () => {   
        const actualResult = getFormattedDate(true);
        expect(actualResult).toBeNull(); 
    });

    it('should return null when input is a number', () => {   
        const actualResult = getFormattedDate(2332890);
        expect(actualResult).toBeNull(); 
    });

    it('should return formatted date when input is valid date', () => {   
        const actualResult = getFormattedDate('2020-01-01');
        expect(actualResult).toBe('01/01/2020'); 
    });
})

describe('getFormattedNumber', () => {

    it('should return null when input is null', () => {   
        const actualResult = getFormattedNumber(null);
        expect(actualResult).toBeNull(); 
    });

    it('should return null when input is not a number', () => {   
        const actualResult = getFormattedNumber("not a number");
        expect(actualResult).toBeNull(); 
    });

    it('should return null when input is boolean', () => {   
        const actualResult = getFormattedNumber(true);
        expect(actualResult).toBeNull(); 
    });

    it('should return formatted number when input is number', () => {   
        const actualResult = getFormattedNumber(1.225);
        expect(actualResult).toBe('1.23'); 
    });

    it('should return formatted number when input is number string', () => {   
        const actualResult = getFormattedNumber('1.225');
        expect(actualResult).toBe('1.23'); 
    });
    
    it('should return formatted number when input is number', () => {   
        const actualResult = getFormattedNumber(1);
        expect(actualResult).toBe('1.00'); 
    });
})

describe('getFormattedValue', () => {
    const cases = [
        [null, ''],
        ['string value 12', 'string value 12'],
        ['2020-02-02', '02/02/2020'],
        ['10.205', '10.21'],
    ]

    test.each(cases)("it should convert %s to %s",(input, expectedResult) => {
        const actualResult = getFormattedValue(input);
        expect(actualResult).toBe(expectedResult);
    })
})

describe('getFromattedValue_otherTypes', () => {
    it('should return formatted number', () => {
        const actualResult = getFormattedValue(20.239);
        expect(actualResult).toBe('20.24');
    })

    it('should return stringified boolean', () => {
        const actualResult = getFormattedValue(true);
        expect(actualResult).toBe('true');
    })

    it('should return formatted date', () => {
        const actualResult = getFormattedValue(new Date('2020-10-01'));
        expect(actualResult).toBe('01/10/2020');
    })
})