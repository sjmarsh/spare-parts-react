import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/esm/Spinner';
import Alert from 'react-bootstrap/Alert'
import NumberFormat from 'react-number-format';

import DetailMode from '../../app/constants/detailMode';
import FetchStatus from '../../app/constants/fetchStatus';

import { showDetail, createPart, updatePart } from './partDetailSlice';
import { fetchParts } from './partListSlice';

const PartDetail = (props) => {
    
    const dispatch = useDispatch();
    const detailMode = useSelector(state => state.partDetail.mode);
    const selectedPart = useSelector(state => state.partDetail.value);
    const detailStatus = useSelector(state => state.partDetail.status);
    
    const currentPage = useSelector(state => state.partsList.currentPage);
       
    const emptyPart = { id: 0, name: "", description: "", weight: 0, price: 0, startDate: "", endDate: "" };
    const [formData, setFormData] = useState(emptyPart);

    useEffect(() => {
        setFormData(selectedPart);
    }, [selectedPart]);
    
    const handleCloseModal = () => dispatch(showDetail({detailMode: DetailMode.Closed, selectedPartId: 0}));
        
    const handleFormDataChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleFormCurrencyDataChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value.replace('$', '') });

    const handleSubmit = (e) => {
        e.preventDefault();

        if(detailMode === DetailMode.Add) {
            dispatch(createPart(formData))
            .then((res) => {
                if(res.meta.requestStatus === 'fulfilled') dispatch(fetchParts(currentPage));
            });    
        }

        if(detailMode === DetailMode.Edit) {
            dispatch(updatePart(formData))
            .then((res) => {
                if(res.meta.requestStatus === 'fulfilled') dispatch(fetchParts(currentPage));
            });
        }
    }

    const getDateForPicker = (dateString) => {
        if(!dateString){
            return ''
        }
        return dateString.substring(0, 10);
    }

    return (
        <div>
            <Modal show={true} onHide={handleCloseModal}>
                <Modal.Body>
                    <h3>{detailMode} Part</h3>
                    { detailStatus === FetchStatus.Idle && 
                        <Spinner animation="border" role="status" >
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    }
                    { detailStatus === FetchStatus.Failed && 
                        <Alert variant='danger'>An error occurred fetching part.</Alert>
                    }
       
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group className='form-group my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name || ""} onChange={handleFormDataChange}/>
                        </Form.Group>
                        <Form.Group className='form-group my-2'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={formData.description || ""} onChange={handleFormDataChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Weight</Form.Label>
                            <NumberFormat name="weight" className="form-control" displayType='number' value={formData.weight || ""} isNumericString={true} 
                                thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} onChange={handleFormDataChange} />
                        </Form.Group>
                        <Form.Group className='form-group my-2'>
                            <Form.Label>Price</Form.Label>
                            <NumberFormat name="price" className="form-control" displayType='number' value={formData.price || ""} isNumericString={true}
                                thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} onChange={handleFormCurrencyDataChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date Start</Form.Label>
                            <Form.Control type="date" name="startDate" value={getDateForPicker(formData.startDate)} onChange={handleFormDataChange}/>
                        </Form.Group>
                        <Form.Group className='form-group my-2'>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" name="endDate" value={getDateForPicker(formData.endDate)} onChange={handleFormDataChange}/>
                        </Form.Group>
                        <div className='my-3'>
                            <Button type="submit">Submit</Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};

export default PartDetail;