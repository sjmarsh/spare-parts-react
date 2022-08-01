import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import IventoryTable from './InventoryTable';
import InventoryTab from './inventoryTab';

import { setCurrentTab } from './inventorySlice';

export default function Inventory() {
    const dispatch = useDispatch();
    const currentTab = useSelector(state => state.inventory.currentTab);

    const setTab = (tabKey) => {
        dispatch(setCurrentTab(tabKey));
    }

    return(
        <div>
            <h3>Inventory</h3>
            <Tabs 
                id="inventory-tabs"
                activeKey={currentTab}
                onSelect={(k) => setTab(k)}
            >
                <Tab eventKey={InventoryTab.Entry} title="Manual Stock Entry">

                </Tab>
                <Tab eventKey={InventoryTab.Stocktake} title="Stocktake">

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
