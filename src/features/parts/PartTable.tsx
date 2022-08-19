import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import DetailMode from '../../app/constants/detailMode';
import FetchStatus from '../../app/constants/fetchStatus';
import TableSettings from '../../app/constants/tableSettings';
import Pager from '../../components/Pager';

import { selectPageOfParts, fetchParts, deletePart, setCurrentPage } from './partListSlice';
import { showDetail, fetchPart } from './partDetailSlice';

const PartTable = () => {
    const dispatch = useAppDispatch();
    const pageOfParts = useAppSelector(selectPageOfParts);
    const totalItemCount = useAppSelector(state => state.partsList.totalItemCount);
    const currentPage = useAppSelector(state => state.partsList.currentPage);
    const partsStatus = useAppSelector(state => state.partsList.status);
    
    useEffect(() => {
        if(partsStatus === FetchStatus.Idle) {
            dispatch(fetchParts(currentPage));
        }
    }, [partsStatus, dispatch, currentPage])

    const handleOnAddPart = () => {
        dispatch(fetchPart(0)).then(
            () => dispatch(showDetail({mode: DetailMode.Add, id: 0}))
        );
    }
    
    const handleOnEditPart = (partId: number) => {
        dispatch(fetchPart(partId)).then(
            () => dispatch(showDetail({mode: DetailMode.Edit, id: partId}))
        );
    }

    const handleOnDeletePart = (partId: number) => {
        dispatch(deletePart(partId)).then((res) => {
            if(res.meta.requestStatus === 'fulfilled') {
                dispatch(fetchParts(currentPage));
            };
        });
    }

    const handleOnPageClick = (pageNumber: number) => {
        dispatch(fetchParts(pageNumber)).then((re) => {
            dispatch(setCurrentPage(pageNumber));
        });
    }

    return (
        <div>
    
        { partsStatus === FetchStatus.Loading && 
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
            {pageOfParts.map((part, index) => (
                <tr key={index}>
                    <td>{part.name}</td>
                    <td>{part.description}</td>
                    <td>{Number(part.weight).toFixed(2)}</td>
                    <td>{new Intl.NumberFormat('en-AU', {style: 'currency', currency: 'AUD'}).format(part.price)}</td>
                    <td>{new Date(part.startDate).toLocaleDateString('en-au')}</td>
                    <td>{part.endDate === null ? '' : new Date(part.endDate || '').toLocaleDateString('en-au')}</td>
                    <td><Button variant="link" onClick={() => handleOnEditPart(part.id)}>Edit</Button></td>
                    <td><Button variant="link" onClick={() => handleOnDeletePart(part.id)}>Delete</Button></td>
                </tr>
            ))}  
            </tbody>
        </Table>
        
        <Pager totalItemCount={totalItemCount} pageSize={TableSettings.PageSize} currentPage={currentPage} onPageClick={handleOnPageClick} />
        
        <Button variant="primary" onClick={handleOnAddPart}>Add Part</Button>
    </div>
    )
}

export default PartTable;