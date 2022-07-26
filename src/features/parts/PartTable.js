import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import DetailMode from '../../app/constants/detailMode';
import FetchStatus from '../../app/constants/fetchStatus';

import { selectAllParts, fetchParts, deletePart } from './partListSlice';
import { showDetail, fetchPart } from './partDetailSlice';

const PartTable = () => {
    const dispatch = useDispatch();
    const parts = useSelector(selectAllParts);
    const partsStatus = useSelector(state => state.parts.status);

    useEffect(() => {
        if(partsStatus === FetchStatus.Idle){
            dispatch(fetchParts());
        }
    }, [partsStatus, dispatch])

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
            if(res.meta.requestStatus === 'fulfilled') dispatch(fetchParts());
        });
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
                    <td>{part.weight}</td>
                    <td>{part.price}</td>
                    <td>{part.startDate}</td>
                    <td>{part.endDate}</td>
                    <td><Button variant="link" onClick={() => handleOnEditPart(part.id)}>Edit</Button></td>
                    <td><Button variant="link" onClick={() => handleOnDeletePart(part.id)}>Delete</Button></td>
                </tr>
            ))}  
            </tbody>
        </Table>    
        <Button variant="primary" onClick={handleOnAddPart}>Add Part</Button>
    </div>
    )
}

export default PartTable;
