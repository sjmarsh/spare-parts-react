import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import { selectAllParts, fetchParts, deletePart, showDetail, fetchPart } from './partSlice';

const PartTable = () => {
    const dispatch = useDispatch();
    const parts = useSelector(selectAllParts);
    const partsStatus = useSelector(state => state.parts.status);

    useEffect(() => {
        if(partsStatus === "idle"){
            dispatch(fetchParts());
        }
    }, [partsStatus, dispatch])

    const handleOnAddPart = () => {
        dispatch(fetchPart(0));
        dispatch(showDetail({detailMode: 'Add', selectPartId: 0}));
    }
    
    const handleOnEditPart = (partId) => {
        dispatch(fetchPart(partId));
        dispatch(showDetail({detailMode: 'Edit', selectedPartId: partId}));
    }

    const handleOnDeletePart = (partId) => {
        dispatch(deletePart(partId));
    }

    return (
        <div>
    
        { partsStatus === 'loading' && 
            <Spinner animation="border" role="status" >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        }
        { partsStatus === 'failed' && 
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
