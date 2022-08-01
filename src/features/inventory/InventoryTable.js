import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import FetchStatus from '../../app/constants/fetchStatus';
import TableSettings from '../../app/constants/tableSettings';
import Pager from '../../components/Pager';

import { fetchInventory, selectPageOfInventory, setHistoryStockPage, setCurrentStockPage } from './inventorySlice';


export default function IventoryTable(props) {
    const dispatch = useDispatch();
    const pageOfInventory = useSelector(selectPageOfInventory);
    const totalItemCount = useSelector(state => state.inventory.totalItemCount);
    const historyStockPage = useSelector(state => state.inventory.historyStockPage);
    const currentStockPage = useSelector(state => state.inventory.currentStockPage);
    const inventoryStatus = useSelector(state => state.inventory.status);

    const [isCurrent, setIsCurrent] = useState(false);

    useEffect(() => {
        setIsCurrent(props.isCurrent);
        if(props.isCurrent){
            dispatch(fetchInventory({ page:currentStockPage, isCurrent: true }));
        }
        else {
            dispatch(fetchInventory({ page:historyStockPage, isCurrent: false }));
        }            
           
    }, [dispatch, props.isCurrent, currentStockPage, historyStockPage]);

    const handleOnPageClick = (pageNumber) => {
        dispatch(fetchInventory({ page:pageNumber, isCurrent: isCurrent })).then((re) => {
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
                            <td>{item.dateRecorded}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pager totalItemCount={totalItemCount} pageSize={TableSettings.PageSize} currentPage={getCurrentPage} onPageClick={handleOnPageClick} />

        </div>
    );
};