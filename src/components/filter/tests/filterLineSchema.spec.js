import { test, expect } from 'vitest';

import FilterField from '../types/filterField';
import FilterLine from '../types/filterLine';
import FilterLineSchema from '../types/filterLineSchema';

test('has no errors when all values set', async () => {
    const filterLine = { selectedField: {}, selectedOperator: "eq", value: "test" };
    const result = await FilterLineSchema.isValid(filterLine);
    expect(result).toEqual(true);
})

test('has error when field is not selected', async () => {
    const filterLine = { selectedField: null, selectedOperator: "eq", value: "test" };
    const result = await FilterLineSchema.isValid(filterLine);
    expect(result).toEqual(false);
})

test('has error when operator is not selected', async () => {
    const filterLine = { selectedField: {}, selectedOperator: null, value: "test" };
    const result = await FilterLineSchema.isValid(filterLine);
    expect(result).toEqual(false);
})

test('has error when value is not entered', async () => {
    const filterLine = { selectedField: {}, selectedOperator: "eq", value: null };
    const result = await FilterLineSchema.isValid(filterLine);
    expect(result).toEqual(false);
})