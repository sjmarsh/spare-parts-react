import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik, Form, FormikProps, FormikValues } from 'formik';

import TextField from '../TextField';


interface TestObject {
    testName: string;
}

test('renders text field', () => {
        
    const formdata: TestObject = { testName: "" };
    const { container, getByText } = render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <TextField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    expect(getByText(/Test Name/i)).toBeInTheDocument();
    const formControls = container.getElementsByClassName('form-control');
    expect(formControls.length).toBe(1);
    expect(formControls[0].classList).not.toContain('modified');
});

test('renders text field with modified', async () => {
    const formdata: TestObject = { testName: "" };
    const { container, getByText } = render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <TextField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    
    expect(await screen.findByTestId('txt-testName')).toBeInTheDocument();
    let input = await screen.findByTestId('txt-testName');
    
    act(() =>{
        fireEvent.blur(input);
        fireEvent.change(input, {target: {value: "abc"}});
    })

    input = await screen.findByTestId('txt-testName');
    await waitFor(() => {
        expect(input.classList).toContain('valid');
        expect(input.classList).toContain('modified');    
    });    
});


// ref: testing Formic validation:  https://scottsauber.com/2019/05/25/testing-formik-with-react-testing-library/
test('renders text field with validation error', async () => {
    const errorMessage = 'Required';
    const formdata: TestObject = { testName: "" };
    
    act(() =>{
    render(
        <Formik 
            initialValues={formdata} 
            onSubmit={()=> {}} 
            validate={(values) => {
                let errors: any = {};
                if(!values?.testName){
                    errors.testName = errorMessage;
                }
                return errors;
            }}>
            {(props) => {     
            return (
                <Form>
                    <TextField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    });

    expect(await screen.findByTestId('txt-testName')).toBeInTheDocument();
    let input = await screen.findByTestId('txt-testName');
    
    act(() =>{
        fireEvent.blur(input);
    });

    input = await screen.findByTestId('txt-testName');
    await waitFor(() => {
        expect(input.classList).toContain('invalid');    
    });
    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage); 

})
