import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage, useField, useFormikContext } from 'formik';
import * as Yup from 'yup';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/esm/Spinner';
import Alert from 'react-bootstrap/Alert'
import NumberFormat from 'react-number-format';

import DetailMode from '../../app/constants/detailMode';
import FetchStatus from '../../app/constants/fetchStatus';

import { showDetail, createPart, updatePart } from './partDetailSlice';
import { fetchParts } from './partListSlice';

const PartDetail = () => {
    
    const dispatch = useDispatch();
    const detailMode = useSelector(state => state.partDetail.mode);
    const selectedPart = useSelector(state => state.partDetail.value);
    const detailStatus = useSelector(state => state.partDetail.status);
    const currentPage = useSelector(state => state.partsList.currentPage);
   
    const PartDetailSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        weight: Yup.number().min(0).required('Required'),
        price: Yup.number().min(0).required('Required'),
        startDate: Yup.date().min('2000-01-01').required('Reqired')
    })

    const handleCloseModal = () => dispatch(showDetail({detailMode: DetailMode.Closed, selectedPartId: 0}));
   
    const handleFormSubmit = (part) => {
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
    }

    const getFieldClassName = (touched, errors) => {
        var modified = touched ? "modified" : "";
        var valid = errors ? "invalid" : "valid";
        return `form-control ${modified} ${valid}`;
    }

    const NumberField = ({...props}) => {      
        const { setFieldValue } = useFormikContext(); 
        const [field] = useField(props);
        const handleThis = (e) =>{
            setFieldValue(e.floatValue);
        }
        // TODO - handle issue when using prefix={'$'} doubles up on $ symbol and doesn't strip symbol when submitting value
        return (
            <NumberFormat {...field} {...props} 
                displayType='number' isNumericString={true} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} 
                onValueChange={(e) => handleThis(e)}/>
        )
    }

    const getDateForPicker = (dateString) => {
        if(!dateString) {
            return '';
        }
        return dateString.substring(0, 10);
    }

    
    const DateField = ({...props}) => {       
        const [field] = useField(props);
        field.value = getDateForPicker(field.value);
        return (
            <input type="date" {...field} {...props}/>           
        )
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
                    <Formik
                        initialValues={selectedPart}
                        validationSchema={PartDetailSchema}
                        onSubmit={(values, {setSubmitting}) => {
                            setSubmitting(true);
                            handleFormSubmit(values);
                        }}
                    >
                        {(props) => {
                            const { isSubmitting, handleSubmit, touched, errors} = props;
                            return (
                            <Form onSubmit={handleSubmit}>
                                <div className='form-group  my-2'>
                                    <label htmlFor="name">Name</label>
                                    <Field type="string" name="name" className={getFieldClassName(touched.name, errors.name)}/>
                                    <ErrorMessage name="name" component="div" className="validation-message"/>
                                </div>
                                <div className='form-group  my-2'>
                                    <label htmlFor="name">Description</label>
                                    <Field type="string" name="description" className={getFieldClassName(touched.description, errors.description)}/>
                                    <ErrorMessage name="description" component="div" className="validation-message"/>
                                </div>
                                <div className='form-group  my-2'>
                                    <label htmlFor="weight">Weight</label>
                                    <NumberField name="weight" className={getFieldClassName(touched.weight, errors.weight)}/>
                                    <ErrorMessage name="weight" component="div" className="validation-message"/>
                                </div>
                                <div className='form-group  my-2'>
                                    <label htmlFor="price">Price</label>
                                    <NumberField name="price" className={getFieldClassName(touched.price, errors.price)}/>
                                    <ErrorMessage name="price" component="div" className="validation-message"/>
                                </div>
                                <div className='form-group  my-2'>
                                    <label htmlFor="startDate">Start Date</label>
                                    <DateField name="startDate" className={getFieldClassName(touched.startDate, errors.startDate)}/>
                                    <ErrorMessage name="startDate" component="div" className="validation-message"/>
                                </div>
                                <div className='form-group  my-2'>
                                    <label htmlFor="endDate">End Date</label>
                                    <DateField name="endDate" className={getFieldClassName(touched.endDate, errors.endDate)}/>
                                    <ErrorMessage name="endDate" component="div" className="validation-message"/>
                                </div>
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