import React from 'react';
import { useSelector } from 'react-redux';

import PartTable from './PartTable';
import PartDetail from './PartDetail';

export function PartList() {
    const detailMode = useSelector(state => state.parts.detailMode);
    const isShowDetail = detailMode === 'Add' || detailMode === 'Edit';
    
    return(
        <div>
            <h3>Part List</h3>
            <PartTable  />
            { isShowDetail &&
                <PartDetail />
            }
        </div>
    )
}