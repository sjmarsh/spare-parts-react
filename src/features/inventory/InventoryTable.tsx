import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import FetchStatus from '../../app/constants/fetchStatus';
import TableSettings from '../../app/constants/tableSettings';
import Pager from '../../components/Pager';

import { fetchInventory, selectPageOfInventory, setHistoryStockPage, setCurrentStockPage } from './inventorySlice';

interface InputProps {
    key: string,
    isCurrent: boolean
};

export default function IventoryTable(props: InputProps) {
    const dispatch = useAppDispatch();
    const pageOfInventory = useAppSelector(selectPageOfInventory);
    const totalItemCount = useAppSelector(state => state.inventory.totalItemCount);
    const historyStockPage = useAppSelector(state => state.inventory.historyStockPage);
    const currentStockPage = useAppSelector(state => state.inventory.currentStockPage);
    const inventoryStatus = useAppSelector(state => state.inventory.status);

    const [isCurrent, setIsCurrent] = useState(false);

    useEffect(() => {
        setIsCurrent(props.isCurrent);
        if(props.isCurrent){
            dispatch(fetchInventory({ page: currentStockPage, isCurrent: true, takeAll: false }));
        }
        else {
            dispatch(fetchInventory({ page: historyStockPage, isCurrent: false, takeAll: false }));
        }            
           
    }, [dispatch, props.isCurrent, currentStockPage, historyStockPage]);

    const handleOnPageClick = (pageNumber: number) => {
        dispatch(fetchInventory({ page: pageNumber, isCurrent: isCurrent, takeAll: false })).then((re) => {
            if(isCurrent){
                dispatch(setCurrentStockPage(pageNumber));
            }
            else {
                dispatch(setHistoryStockPage(pageNumber));
            }
        });
    }

    const getCurrentPage = () => {
        return isCurrent ? currentStockPage : historyStockPage;
    }

    return (
        <div>
            { inventoryStatus === FetchStatus.Loading && 
            <Spinner animation="border" role="status" >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            }
            { inventoryStatus === FetchStatus.Failed && 
                <Alert variant='danger'>An error occurred fetching inventory.</Alert>
            }
          
            <Table hover>
                <thead>
                    <tr>
                        <th>Part Name</th>
                        <th>Quantity</th>
                        <th>Date Recorded</th>
                    </tr>
                </thead>
                <tbody>
                    {pageOfInventory.map((item, index) => (
                        <tr key={index}>
                            <td>{item.partName}</td>
                            <td>{item.quantity}</td>
                            <td>{new Date(item.dateRecorded).toLocaleString('en-AU')}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pager totalItemCount={totalItemCount} pageSize={TableSettings.PageSize} currentPage={getCurrentPage} onPageClick={handleOnPageClick} key={isCurrent} />

        </div>
    );
};