import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { selectParts, deletePart } from './partSlice';
import PartDetail from './PartDetail';

export function PartList() {
    const dispatch = useDispatch();
    const parts = useSelector(selectParts);
    
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleOnDeletePart = (partId) => {
        dispatch(deletePart(partId));
    }

    return(
        <div>
            <h3>Part List</h3>
            
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
                            <td><Button variant="link">Edit</Button></td>
                            <td><Button variant="link" onClick={() => handleOnDeletePart(part.id)}>Delete</Button></td>
                        </tr>
                    ))}  
                    </tbody>
                </Table>
                
            </div> 
            
            <Button variant="primary" onClick={handleShowModal}>
                Add Part
            </Button>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Body>
                    <PartDetail mode="Add"/>
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