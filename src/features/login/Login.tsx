import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Formik, Form } from 'formik';

import { Button, Spinner, Alert } from 'react-bootstrap';
import TextField from '../../components/TextField';
import FetchStatus from "../../app/constants/fetchStatus";

import AuthenticationRequest from './types/AuthenticationRequest';

import { performLogin } from './loginSlice';
import LoginSchema from './loginSchema';

export default function Login() {
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const dispatch = useAppDispatch();
    
    const loginFetchStatus = useAppSelector(state => state.login.fetchStatus);
    const isAuthenticated = useAppSelector(state => state.login.isAuthenticated);

    const handleFormSubmit = (request: AuthenticationRequest) => {
        dispatch(performLogin(request));    
        setHasSubmitted(true);
    }

    return (
        <div>
            { loginFetchStatus === FetchStatus.Loading && 
                <Spinner animation="border" role="status" >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
                                            
            <Formik
                initialValues={{ userName: '', password: '' } as AuthenticationRequest}
                validationSchema={LoginSchema}
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
                        <TextField name="userName" displayName="User Name" formProps={props}/>
                        <TextField name="password" displayName="Password" isPassword={true} formProps={props}/>
                        <div className='my-3'>
                            <Button type="submit" disabled={isSubmitting}>Login</Button>
                        </div>
                    </Form>
                    )
                }}
            </Formik>
            { hasSubmitted && loginFetchStatus === FetchStatus.Succeeded && isAuthenticated && 
                <Alert variant='success' className="py-1">Success</Alert>
            }
            {
                hasSubmitted && loginFetchStatus === FetchStatus.Succeeded && !isAuthenticated && 
                <Alert variant='danger' className="py-1">Login failed</Alert>
            }
            { loginFetchStatus === FetchStatus.Failed && 
                <Alert variant='danger' className="py-1">An error occurred logging in.</Alert>
            }
        </div>
    );
};