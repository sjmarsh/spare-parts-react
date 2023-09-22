import { randomInt } from '../randomHelper';
import { describe, it, expect } from 'vitest';

describe('randomInt', () => {

    it('should generate random int less than max value', () => {
        const maxValue = 5;

        const result = randomInt(maxValue);

        expect(result).toBeLessThan(maxValue);
    })

    it('should generate random int greater than zero', () => {
        const maxValue = 5;

        const result = randomInt(maxValue);

        expect(result).toBeGreaterThan(0);
    })
    
})

