import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPart, removePart, selectParts } from './partSlice';
import PartItem from './PartItem'

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
            <form onSubmit={(e) => handleSubmit(e)}>
                <p>Name:</p>
                <input type="text" name="name" value={inputPart.name} onChange={handleInputChange}></input>
                <p>Weight:</p>
                <input type="text" name="weight" value={inputPart.weight}  onChange={handleInputChange}></input>
                <p>Date Start:</p>
                <input type="text" name="dateStart" value={inputPart.dateStart}  onChange={handleInputChange}></input>
                <button type='submit'>Add Part</button>
            </form>
            <div>
                {parts.map((part, index) => (
                    <PartItem key={index} part={part}/>
                ))}  
            </div>  
        </div>
    )
}