import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import DetailMode from '../../app/constants/detailMode';
import FetchStatus from '../../app/constants/fetchStatus';
import TableSettings from '../../app/constants/tableSettings';
import Pager from '../../components/Pager';

import { selectAllParts, fetchParts, deletePart } from './partListSlice';
import { showDetail, fetchPart } from './partDetailSlice';

const PartTable = () => {
    const dispatch = useDispatch();
    const parts = useSelector(selectAllParts);
    const totalItemCount = useSelector(state => state.partsList.totalItemCount);
    const currentPage = useSelector(state => state.partsList.currentPage);
    const partsStatus = useSelector(state => state.partsList.status);
    
    useEffect(() => {
        if(partsStatus === FetchStatus.Idle) {
            dispatch(fetchParts(currentPage));
        }
    }, [partsStatus, dispatch, currentPage])

    const handleOnAddPart = () => {
        dispatch(fetchPart(0)).then(
            () => dispatch(showDetail({detailMode: DetailMode.Add, selectPartId: 0}))
        );
    }
    
    const handleOnEditPart = (partId) => {
        dispatch(fetchPart(partId)).then(
            () => dispatch(showDetail({detailMode: DetailMode.Edit, selectedPartId: partId}))
        );
    }

    const handleOnDeletePart = (partId) => {
        dispatch(deletePart(partId)).then((res) => {
            if(res.meta.requestStatus === 'fulfilled') dispatch(fetchParts(currentPage));
        });
    }

    const handleOnPageClick = (pageNumber) => {
        dispatch(fetchParts(pageNumber));
    }

    return (
        <div>
    
        { partsStatus === FetchStatus.Idle && 
            <Spinner animation="border" role="status" >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        }
        { partsStatus === FetchStatus.Failed && 
            <Alert variant='danger'>An error occurred fetching parts.</Alert>
        }
       
        <Table hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Weight</th>
                    <th>Price</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {parts.map((part, index) => (
                <tr key={index}>
                    <td>{part.name}</td>
                    <td>{part.description}</td>
                    <td>{Number(part.weight).toFixed(2)}</td>
                    <td>{new Intl.NumberFormat('en-AU', {style: 'currency', currency: 'AUD'}).format(part.price)}</td>
                    <td>{new Date(part.startDate).toLocaleDateString('en-au')}</td>
                    <td>{part.endDate === null ? '' : new Date(part.endDate).toLocaleDateString('en-au')}</td>
                    <td><Button variant="link" onClick={() => handleOnEditPart(part.id)}>Edit</Button></td>
                    <td><Button variant="link" onClick={() => handleOnDeletePart(part.id)}>Delete</Button></td>
                </tr>
            ))}  
            </tbody>
        </Table>
        
        <Pager totalItemCount={totalItemCount} pageSize={TableSettings.PageSize} onPageClick={handleOnPageClick} />
        
        <Button variant="primary" onClick={handleOnAddPart}>Add Part</Button>
    </div>
    )
}

export default PartTable;
