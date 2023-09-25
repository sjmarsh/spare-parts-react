import { camelize } from '../stringHelper';
import { describe, it, expect } from 'vitest';

describe('camelize', () => {

    const cases = [
        ['the', 'the'], 
        ['The', 'the'], 
        [' the', 'the'], 
        ['the ', 'the'], 
        ['the string', 'theString'],
        ['The string', 'theString'],
        ['The String', 'theString'],
        ['THE STRING', 'theString'],
        ['THE_String', 'theString'],
        ['THE-String', 'theString'],
        ['THE-String is_BIG', 'theStringIsBig'],
    ]

    test.each(cases)("it should convert %s to %s",(input, expectedResult) => {
        const actualResult = camelize(input);
        expect(actualResult).toBe(expectedResult);
    });
})