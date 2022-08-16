import React from 'react';
import { useAppSelector } from '../../app/hooks';

import DetailMode from '../../app/constants/detailMode';

import PartTable from './PartTable';
import PartDetail from './PartDetail';

export default function PartList() {
    const detailMode = useAppSelector(state => state.partDetail.mode);
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