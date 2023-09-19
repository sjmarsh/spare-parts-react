import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Formik, Form } from 'formik';

import { Button, Modal, Spinner, Alert } from 'react-bootstrap';
import TextField from '../../components/TextField';
import SelectField from '../../components/SelectField';
import NumericField from '../../components/NumericField';
import DateField from '../../components/DateField';

import Part from './types/Part';
import PartDetailSchema from './partDetailSchema';
import DetailMode from '../../app/constants/detailMode';
import FetchStatus from '../../app/constants/fetchStatus';

import { showDetail, createPart, updatePart } from './partDetailSlice';
import { fetchParts } from './partListSlice';
import PartCategory from './types/partCategory';

const PartDetail = () => {
    
    const [hasSubmitted, setHasSubmitted] = useState(false);
     
    const dispatch = useAppDispatch();

    const detailMode = useAppSelector(state => state.partDetail.mode);
    const selectedPart = useAppSelector(state => state.partDetail.value);
    const detailStatus = useAppSelector(state => state.partDetail.status);
    const currentPage = useAppSelector(state => state.partsList.currentPage);
   
    const handleCloseModal = () => dispatch(showDetail({mode: DetailMode.Closed, id: 0}));
   
    const handleFormSubmit = (part: Part) => {
        if(detailMode === DetailMode.Add) {
            dispatch(createPart(part))
            .then((res) => {
                if(res.meta.requestStatus === 'fulfilled') dispatch(fetchParts(currentPage));
            });    
        }

        if(detailMode === DetailMode.Edit) {
            dispatch(updatePart(part))
            .then((res) => {
                if(res.meta.requestStatus === 'fulfilled') dispatch(fetchParts(currentPage));
            });
        }
        setHasSubmitted(true);
    }

    return (
        <div>
            <Modal show={true} onHide={handleCloseModal}>
                <Modal.Body>
                    <h3>{detailMode} Part</h3>
                    { detailStatus === FetchStatus.Loading && 
                        <Spinner animation="border" role="status" >
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    }
                    { detailStatus === FetchStatus.Failed && 
                        <Alert variant='danger'>An error occurred fetching part.</Alert>
                    }
                    { hasSubmitted && detailStatus === FetchStatus.Succeeded &&
                        <Alert variant='success'>Success</Alert>
                    }
                    <Formik
                        initialValues={selectedPart}
                        validationSchema={PartDetailSchema}
                        onSubmit={(values, {setSubmitting}) => {
                            setSubmitting(true);
                            handleFormSubmit(values);
                            setSubmitting(false);
                        }}
                    >
                        {(props) => {
                            const { isSubmitting, handleSubmit } = props;
                            return (
                            <Form onSubmit={handleSubmit}>
                                <TextField name="name" displayName="Name" formProps={props}/>
                                <TextField name="description" displayName="Description" formProps={props}/>
                                <SelectField name="category" displayName="Category" selectOptions={Object.keys(PartCategory)} formProps={props}/>
                                <NumericField name="weight" displayName="Weight" formProps={props}/>
                                <NumericField name="price" displayName="Price" formProps={props}/>
                                <DateField name="startDate" displayName="Start Date" formProps={props}/>
                                <DateField name="endDate" displayName="End Date" formProps={props}/>
                                <div className='my-3'>
                                    <Button type="submit" disabled={isSubmitting}>Submit</Button>
                                </div>
                            </Form>
                            )
                        }}
                    </Formik>
                
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};

export default PartDetail;