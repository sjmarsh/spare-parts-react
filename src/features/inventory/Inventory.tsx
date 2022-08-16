import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ManualStockEntry from './ManualStockEntry';
import Stocktake from './Stocktake';
import IventoryTable from './InventoryTable';
import InventoryTab from './types/inventoryTab';

import { setCurrentTab } from './inventorySlice';

export default function Inventory() {
    const dispatch = useAppDispatch();
    const currentTab = useAppSelector(state => state.inventory.currentTab);
    
    useEffect(() => {
        if(!currentTab) {
            dispatch(setCurrentTab(InventoryTab.Entry));
        }
    }, [currentTab, dispatch]);

    const setTab = (tabKey: InventoryTab) => {
        dispatch(setCurrentTab(tabKey));
    };

    const setTabFromKey = (key?: string | null) => {
        if(key){
            let tab = key as unknown as InventoryTab;
            setTab(tab);
        }
    }
    
    return (
        <div>
            <h3>Inventory</h3>
            <Tabs
                id="inventory-tabs"
                activeKey={currentTab}
                onSelect={(k) => setTabFromKey(k)}>
                <Tab eventKey={InventoryTab.Entry} title="Manual Stock Entry">
                    {currentTab === InventoryTab.Entry && <ManualStockEntry /> } 
                </Tab>
                <Tab eventKey={InventoryTab.Stocktake} title="Stocktake">
                    {currentTab === InventoryTab.Stocktake && <Stocktake key="stocktake" /> } 
                </Tab>
                <Tab eventKey={InventoryTab.Current} title="Current Stock">
                    {currentTab === InventoryTab.Current && <IventoryTable key="current" isCurrent={true}/>}
                </Tab>
                <Tab eventKey={InventoryTab.History} title="History">
                    {currentTab === InventoryTab.History && <IventoryTable key="history" isCurrent={false}/>}
                </Tab>
            </Tabs>
        </div>
    );
};
