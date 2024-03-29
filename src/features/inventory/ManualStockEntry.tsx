import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Formik, Form, Field } from "formik";

import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import TextField from "../../components/TextField";
import FetchStatus from "../../app/constants/fetchStatus";
import { getLocalDateTimeString } from "../../app/helpers/dateTime";

import { selectCurrentParts, fetchCurrentParts, createInventoryItem } from "./inventorySlice";
import InventoryItem from "./types/InventoryItem";
import InventoryItemSchmea from "./inventoryItemSchema";

export default function ManualStockEntry() {
    const dispatch = useAppDispatch();
    const currentParts = useAppSelector(selectCurrentParts);
    const inventoryStatus = useAppSelector(state => state.inventory.status);

    const [hasSubmitted, setHasSubmitted] = useState(false);
    
    useEffect(() => {
        if(inventoryStatus === FetchStatus.Idle) {
            dispatch(fetchCurrentParts());
        }
    }, [inventoryStatus, dispatch]);

    const handleFormSubmit = (item: InventoryItem) => {
        item.dateRecorded = getLocalDateTimeString();
        dispatch(createInventoryItem(item));
        setHasSubmitted(true);
    };

    return (
        <div>
            { inventoryStatus === FetchStatus.Loading && 
                <Spinner animation="border" role="status" >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
                                            
            <Formik
                initialValues={{} as InventoryItem}
                validationSchema={InventoryItemSchmea}
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
                        <Row className="justify-content-start w-75">
                            <Col sm={6}>
                                <div className="form-group my-2">
                                    <label htmlFor="partId">Select Part</label>
                                    <Field as="select" name="partId" className="form-select">
                                        {currentParts.map((part, index) => (
                                            <option value={part.id} key={index}>{part.name}</option>
                                        ))};
                                    </Field>
                                </div>
                            </Col>
                            <Col sm={2}>
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