import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import { selectAllParts, fetchParts, deletePart } from './partSlice';
import PartDetail from './PartDetail';

export function PartList() {
    const dispatch = useDispatch();
    const parts = useSelector(selectAllParts);
    const partsStatus = useSelector(state => state.parts.status);
    
    useEffect(() => {
        if(partsStatus === "idle"){
            dispatch(fetchParts());
        }
    }, [partsStatus, dispatch])

    const [showModal, setShowModal] = useState(false);
    const [partDetailMode, setPartDetailMode] = useState("Add");
    const [selectedPartId, setSelectedPartId] = useState(0);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleOnAddPart = () => {
        setPartDetailMode("Add");
        handleShowModal();
    }

    const handleOnEditPart = (partId) => {
        setPartDetailMode("Edit");
        setSelectedPartId(partId);
        handleShowModal();
    }

    const handleOnDeletePart = (partId) => {
        dispatch(deletePart(partId));
    }
    
    return(
        <div>
            <h3>Part List</h3>
            { partsStatus === 'loading' && 
            <Spinner animation="border" role="status" >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            }
            { partsStatus === 'failed' && 
                <Alert variant='danger'>An error occurred fetching parts.</Alert>
            }
            <div>
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
                
            </div> 
            
            <Button variant="primary" onClick={handleOnAddPart}>
                Add Part
            </Button>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Body>
                    <PartDetail mode={partDetailMode} partId={selectedPartId}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}