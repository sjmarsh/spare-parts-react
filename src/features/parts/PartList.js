import React from 'react';
import { useSelector } from 'react-redux';

import DetailMode from '../../app/constants/detailMode';

import PartTable from './PartTable';
import PartDetail from './PartDetail';

export function PartList() {
    const detailMode = useSelector(state => state.partDetail.mode);
    const isShowDetail = detailMode === DetailMode.Add || detailMode === DetailMode.Edit;
    
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