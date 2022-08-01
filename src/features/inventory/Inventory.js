import React from 'react';
import { useSelector } from 'react-redux';

import IventoryTable from './InventoryTable';

export default function Inventory() {

    return(
        <div>
            <h3>Inventory</h3>

            <IventoryTable/>
        </div>
    );
};
