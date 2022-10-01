import { test, expect } from 'vitest';

import PartDetailSchema from '../partDetailSchema';

const getTestPart = () => {
    return {
        name: "name",
        description: "description", 
        weight: 1.1,
        price: 2.2,
        startDate: '2020-12-31',
        endDate: '2022-12-31'
    }
}

test('has no errors when validation criteria met', async () => {
    const part = getTestPart();
    const result = await PartDetailSchema.isValid(part);
    expect(result).toEqual(true);
})

test('has error when name is blank', async () => {
    const part = getTestPart();
    part.name = null;
    const result = await PartDetailSchema.isValid(part);
    expect(result).toEqual(false);
})

test('has error when weight is blank', async () => {
    const part = getTestPart();
    part.weight = null;
    const result = await PartDetailSchema.isValid(part);
    expect(result).toEqual(false);
})

test('has error when weight less than zero', async () => {
    const part = getTestPart();
    part.weight = -1;
    const result = await PartDetailSchema.isValid(part);
    expect(result).toEqual(false);
})

test('has error when price is blank', async () => {
    const part = getTestPart();
    part.price = null;
    const result = await PartDetailSchema.isValid(part);
    expect(result).toEqual(false);
})

test('has error when price is less than zero', async () => {
    const part = getTestPart();
    part.price = -0.1;
    const result = await PartDetailSchema.isValid(part);
    expect(result).toEqual(false);
})

test('has error when start date is blank', async () => {
    const part = getTestPart();
    part.startDate = null;
    const result = await PartDetailSchema.isValid(part);
    expect(result).toEqual(false);
})

test('has error when start date is before 2000', async () => {
    const part = getTestPart();
    part.startDate = '1999-12-31';
    const result = await PartDetailSchema.isValid(part);
    expect(result).toEqual(false);
})