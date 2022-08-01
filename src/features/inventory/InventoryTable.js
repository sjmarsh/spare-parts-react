import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import FetchStatus from '../../app/constants/fetchStatus';
import TableSettings from '../../app/constants/tableSettings';
import Pager from '../../components/Pager';

import { fetchInventory, selectPageOfInventory, setCurrentPage } from './inventorySlice';


export default function IventoryTable(props) {
    const dispatch = useDispatch();
    const pageOfInventory = useSelector(selectPageOfInventory);
    const totalItemCount = useSelector(state => state.inventory.totalItemCount);
    const currentPage = useSelector(state => state.inventory.currentPage);
    const inventoryStatus = useSelector(state => state.inventory.status);

    useEffect(() => {
        if(inventoryStatus === FetchStatus.Idle) {
            dispatch(fetchInventory(currentPage));
        }
    }, [inventoryStatus, dispatch, currentPage]);

    const handleOnPageClick = (pageNumber) => {
        dispatch(fetchInventory(pageNumber)).then((re) => {
            dispatch(setCurrentPage(pageNumber));
        });
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

            <Pager totalItemCount={totalItemCount} pageSize={TableSettings.PageSize} currentPage={currentPage} onPageClick={handleOnPageClick} />

        </div>
    );
};