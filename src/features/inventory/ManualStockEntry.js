import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";

import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import TextField from "../../components/TextField";
import FetchStatus from "../../app/constants/fetchStatus";

import { selectCurrentParts, fetchCurrentParts, createInventoryItem } from "./inventorySlice";

export default function ManualStockEntry() {
    const dispatch = useDispatch();
    const currentParts = useSelector(selectCurrentParts);
    const inventoryStatus = useSelector(state => state.inventory.status);

    const [hasSubmitted, setHasSubmitted] = useState(false);
    
    useEffect(() => {
        if(inventoryStatus === FetchStatus.Idle) {
            dispatch(fetchCurrentParts());
        }
    }, [inventoryStatus, dispatch]);

    const handleFormSubmit = (item) => {
        item.dateRecorded = new Date().toISOString();
        dispatch(createInventoryItem(item));
        setHasSubmitted(true);
    }

    return (
        <div>
            { inventoryStatus === FetchStatus.Loading && 
                <Spinner animation="border" role="status" >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
                                            
            <Formik
                initialValues={{
                    partId: 1,
                    quantity: 0 
                }}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    setSubmitting(true);
                    handleFormSubmit(values);
                    setSubmitting(false);
                    resetForm();
                }}    
                >
                {(props) => {
                    const { isSubmitting, handleSubmit } = props;
                    return (
                <Form onSubmit={handleSubmit}>
                    <Container fluid>
                        <Row className="justify-content-start">
                            <Col>
                                <div className="form-group my-2">
                                    <label htmlFor="partId">Select Part</label>
                                    <Field as="select" name="partId" className="form-select">
                                        {currentParts.map((part, index) => (
                                            <option value={part.id} key={index}>{part.name}</option>
                                        ))};
                                    </Field>
                                </div>
                            </Col>
                            <Col>
                                <TextField name="quantity" displayName="Quantity" formProps={props}/>
                            </Col>
                        </Row>
                    </Container>
                    <div className="my-3">
                        <Button type="submit" variant="primary" disabled={isSubmitting}>Submit</Button>
                    </div>
                </Form>
                )}}
            </Formik>
            { hasSubmitted && inventoryStatus === FetchStatus.Succeeded &&
                <Alert variant='success' className="py-1">Success</Alert>
            }
            { inventoryStatus === FetchStatus.Failed && 
                <Alert variant='danger' className="py-1">An error occurred submitting inventory item.</Alert>
            }
        </div>
    );
}