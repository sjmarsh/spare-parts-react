import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { addPart, removePart, selectParts } from './partSlice';
import PartListItem from './PartListItem'

export function PartList() {
    const [inputPart, setInputPart] = useState({
        name: "",
        weight: 0,
        dateStart: "2020-01-01"
    });
    const parts = useSelector(selectParts);
    const dispatch = useDispatch();

    function handleInputChange(e) {
        console.log(`name: ${e.target.name} value: ${e.target.value}`);
        setInputPart({
          ...inputPart,
          [e.target.name]: e.target.value
        });
      }


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addPart(inputPart));
    }

    return(
        <div>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Group className='form-group my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={inputPart.name} onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Weight</Form.Label>
                    <Form.Control type="text" name="weight" value={inputPart.weight}  onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date Start</Form.Label>
                    <Form.Control type="text" name="dateStart" value={inputPart.dateStart}  onChange={handleInputChange}/>
                </Form.Group>
                <div className='my-3'>
                    <Button type="submit">Add Part</Button>
                </div>
            </Form>
            <div>
                
                {parts.map((part, index) => (
                    <PartListItem key={index} part={part}/>
                ))}  
            </div>  
        </div>
    )
}