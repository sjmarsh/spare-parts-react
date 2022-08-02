import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { Table, Button, Spinner, Alert } from "react-bootstrap";
import FetchStatus from "../../app/constants/fetchStatus";
import { fetchInventory, selectStocktakeItems, createInventoryItemList } from "./inventorySlice";
import StocktakeItemsSchema from "./stocktakeItemsSchema";

export default function Stocktake() {
    const dispatch = useDispatch();
    const stocktakeItems = useSelector(selectStocktakeItems);
    const inventoryStatus = useSelector(state => state.inventory.status);   
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        dispatch(fetchInventory({ page: 0, isCurrent: true, takeAll: true }));
    }, [dispatch]);
    
    const handleFormSubmit = (items) => {
        if(items) {
            let datedItems = items.map(i => ({...i, dateRecorded: new Date().toISOString()}));
            dispatch(createInventoryItemList(datedItems));
        }
                
        setHasSubmitted(true);
    }

    return (
        <div>
            <h3>Stocktake</h3>
          
            { inventoryStatus === FetchStatus.Loading && 
                <Spinner animation="border" role="status" >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            
            <Formik
                enableReinitialize={true}
                initialValues={{ items:  stocktakeItems }}
                validationSchema={StocktakeItemsSchema}
                onSubmit={(values, {setSubmitting}) => {
                    console.log('submit');
                    setSubmitting(true);
                    handleFormSubmit(values.items);
                    setSubmitting(false);
                }}
            >
                {(props) => {
                    const { values, isSubmitting, handleSubmit } = props;
                    return (
                        <Form onSubmit={handleSubmit}>
                            <div>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Part Name</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {values.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {item.partName}
                                            </td>
                                            <td>
                                                <div>
                                                <Field name={`items[${index}].quantity`} type="number" pattern="[0-9]" className="form-control w-25"/>
                                                <ErrorMessage name={`items[${index}].quantity`} component="div" className="validation-message"/>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </div>
                            <div className="my-3">
                                <Button type="submit" variant="primary" disabled={isSubmitting}>Submit</Button>
                            </div>  
                        </Form>
                    )}
                }
            </Formik>
            
            { hasSubmitted && inventoryStatus === FetchStatus.Succeeded &&
                <Alert variant='success' className="py-1">Success</Alert>
            }
            { inventoryStatus === FetchStatus.Failed && 
                <Alert variant='danger' className="py-1">An error occurred submitting stocktake.</Alert>
            }           
        </div>
    );
};