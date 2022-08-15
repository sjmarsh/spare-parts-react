import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { Formik, Form } from 'formik';

import TextField from '../TextField';


test('renders text field', () => {
    const fakeFormProps = {
        touched: [], 
        errors: [], 
        initialValues: [], 
        values: []
    };
    const { container, getByText } = render(
        <Formik>
            <Form>
                <TextField name="testName" displayName = "Test Name" formProps={fakeFormProps}/>
            </Form>
        </Formik>
    );
    expect(getByText(/Test Name/i)).toBeInTheDocument();
    const formControls = container.getElementsByClassName('form-control');
    expect(formControls.length).toBe(1);
    expect(formControls[0].classList).not.toContain('modified');
});

test('renders text field with modified', () => {
    const fakeFormProps = {
        touched: {testName:true}, 
        errors: [], 
        initialValues: {testName:null}, 
        values: {testName:'abc'}
    };
    const { container, getByText } = render(
        <Formik>
            <Form>
                <TextField name="testName" displayName = "Test Name" formProps={fakeFormProps}/>
            </Form>
        </Formik>
    );
    expect(getByText(/Test Name/i)).toBeInTheDocument();
    const formControls = container.getElementsByClassName('form-control');
    expect(formControls.length).toBe(1);
    expect(formControls[0].classList).toContain('modified');
    expect(formControls[0].classList).toContain('valid');
});


// ref: testing Formic validation:  https://scottsauber.com/2019/05/25/testing-formik-with-react-testing-library/
test('renders text field with validation error', async () => {
    const errorMessage = 'Required';
    const fakeFormProps = {
        touched: {}, 
        errors: {testName: errorMessage}, 
        initialValues: {testName: null}, 
        values: {testName: null}
    };
    render(
        <Formik validate={(values) => {
            return fakeFormProps.errors;
        }}>           
            <Form>
                <TextField name="testName" displayName = "Test Name" formProps={fakeFormProps}/>
            </Form>
            
        </Formik>
    );
 
    const input = await screen.findByTestId('txt-testName');
    
    act(() =>{
        fireEvent.blur(input);
    })

    expect(input.classList).toContain('invalid');
    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage);
})