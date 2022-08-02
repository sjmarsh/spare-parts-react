import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

import config from '../../config.json';

import FetchStatus from '../../app/constants/fetchStatus';
import TableSettings from '../../app/constants/tableSettings';

const initialState = {
    currentTab: "",
    items: [],
    currentParts: [],
    totalItemCount: 0,
    currentStockPage: 1,
    historyStockPage: 1,
    status: FetchStatus.Idle,
    error: null
};

const baseUrl = `${config.SERVER_URL}/api/inventory`;

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async (options) => {
    let current = options.isCurrent ? "isCurrentOnly=true&" : "";
    let skip = (options.page -1) * TableSettings.PageSize;
    let skipQuery = options.takeAll ? "" : `skip=${skip}&take=${TableSettings.PageSize}`;
    const response = await client.get(`${baseUrl}/index-detail?${current}${skipQuery}`);
    return response.data;  
})

export const createInventoryItem = createAsyncThunk('inventory/createInventoryItem', async(item) => {
    if(!item) {
        console.log("Can't create null inventory item");
        return;
    }
    const response = await client.post(baseUrl, item);
    return response.data.value;
})

export const createInventoryItemList = createAsyncThunk('inventory/createInventoryItemList', async(items) => {
    if(!items || items.length === 0){
        console.log("Can't create null inventory items");
        return;
    }
    const response = await client.post(`${baseUrl}/post-list`, items);
    return response.data;
})

export const fetchCurrentParts = createAsyncThunk('inventory/fetchCurrentParts', async () => {
    const url = `${config.SERVER_URL}/api/part/index?isCurrentOnly=true`;
    const response = await client.get(url);
    return response.data;
})

export const inventorySlice = createSlice({
    name: "ivnentory",
    initialState,
    reducers: {
        setCurrentTab: (state, action) => {
            state.currentTab = action.payload
        },
        setCurrentStockPage: (state, action) => {
            state.currentStockPage = action.payload      
        },
        setHistoryStockPage: (state, action) => {
            state.historyStockPage = action.payload      
        }
    },
    extraReducers(builder){
        builder
            .addCase(fetchInventory.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.status = FetchStatus.Succeeded;
                state.items = action.payload.items;
                state.totalItemCount = action.payload.totalItemCount;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
            .addCase(createInventoryItem.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(createInventoryItem.fulfilled, (state, action) => {
                state.status = FetchStatus.Succeeded;
            })
            .addCase(createInventoryItem.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
            .addCase(createInventoryItemList.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(createInventoryItemList.fulfilled, (state, action) => {
                state.status = FetchStatus.Succeeded;
            })
            .addCase(createInventoryItemList.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
            .addCase(fetchCurrentParts.pending, (state, action) => {
                state.status = FetchStatus.Loading;
            })
            .addCase(fetchCurrentParts.fulfilled, (state, action) => {
                state.status = FetchStatus.Succeeded;
                state.currentParts = action.payload.items;
                state.totalItemCount = action.payload.totalItemCount;
            })
            .addCase(fetchCurrentParts.rejected, (state, action) => {
                state.status = FetchStatus.Failed;
                state.error = action.error.message;
            })
    }

});

export const selectPageOfInventory = (state) => state.inventory.items;
export const selectStocktakeItems = (state) => state.inventory.items.map(item => ({ partID: item.partID, partName: item.partName, quantity: 0 }));
export const selectCurrentParts = (state) => state.inventory.currentParts;

export const {
    setCurrentTab,
    setCurrentStockPage,
    setHistoryStockPage,
} = inventorySlice.actions;

export default inventorySlice.reducer;

