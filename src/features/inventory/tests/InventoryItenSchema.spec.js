import InventoryItemSchmea from "../inventoryItemSchema";
import { test, expect } from 'vitest';

const getInventoryItem = () => {
    return {
        partId: 1,
        quantity: 2
    };
};

test('has no errors when validation criteria met', async () => {
    const item = getInventoryItem();
    const result = await InventoryItemSchmea.isValid(item);
    expect(result).toBe(true);
})

test('has error when partId is blank', async () => {
    const item = getInventoryItem();
    item.partId = null;
    const result = await InventoryItemSchmea.isValid(item);
    expect(result).toBe(false);
})

test('has error when partId is zero', async () => {
    const item = getInventoryItem();
    item.partId = 0;
    const result = await InventoryItemSchmea.isValid(item);
    expect(result).toBe(false);
})

test('has error when quantity is null', async () => {
    const item = getInventoryItem();
    item.quantity = null;
    const result = await InventoryItemSchmea.isValid(item);
    expect(result).toBe(false);
})

test('has error when quantity is less than zero', async () => {
    const item = getInventoryItem();
    item.quantity = -1;
    const result = await InventoryItemSchmea.isValid(item);
    expect(result).toBe(false);
})


