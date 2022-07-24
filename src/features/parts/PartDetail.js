import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { addPart, selectPartById } from './partSlice';

const PartDetail = (props) => {
    const editPart = useSelector(state => selectPartById(state, props.partId)); 
    
    const setInitialPart = () => {
        if(props.mode === 'Edit' && editPart){
            return editPart;
        }
        else{
            return {
                id: 0,
                name: "",
                description: "",
                weight: 0,
                price: 0,
                startDate: "2020-01-01",
                endDate: "2020-01-01"
            }
        }
    }
    
    const [inputPart, setInputPart] = useState(() => setInitialPart());
    
    const dispatch = useDispatch();

    const handleInputChange = (e) => setInputPart({ ...inputPart, [e.target.name]: e.target.value });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addPart(inputPart));
    }

    return (
        <div>
            <h3>{props.mode} Part</h3>
            <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className='form-group my-2'>
                    <Form.Label>Id</Form.Label>
                    <Form.Control type="text" name="id" value={inputPart.id} onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group className='form-group my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={inputPart.name} onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group className='form-group my-2'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" value={inputPart.description} onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Weight</Form.Label>
                    <Form.Control type="text" name="weight" value={inputPart.weight} onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group className='form-group my-2'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="text" name="price" value={inputPart.price} onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date Start</Form.Label>
                    <Form.Control type="text" name="startDate" value={inputPart.startDate} onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group className='form-group my-2'>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="text" name="endDate" value={inputPart.endDate} onChange={handleInputChange}/>
                </Form.Group>
                <div className='my-3'>
                    <Button type="submit">Submit</Button>
                </div>
            </Form>
        </div>
    )
};

export default PartDetail;