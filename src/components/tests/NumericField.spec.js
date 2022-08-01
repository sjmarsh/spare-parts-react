import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { Formik, Form } from 'formik';

import NumericField from '../NumericField';

test('renders numeric field', () => {
    const fakeFormProps = {
        touched: [], 
        errors: [], 
        initialValues: [], 
        values: []
    };
    const { container, getByText } = render(
        <Formik>
            <Form>
                <NumericField name="testName" displayName = "Test Name" formProps={fakeFormProps}/>
            </Form>
        </Formik>
    );
    expect(getByText(/Test Name/i)).toBeInTheDocument();
    const formControls = container.getElementsByClassName('form-control');
    expect(formControls.length).toBe(1);
    expect(formControls[0].classList).not.toContain('modified');
})

test('renders numeric field with modified', () => {
    const fakeFormProps = {
        touched: {testName:true}, 
        errors: [], 
        initialValues: {testName:null}, 
        values: {testName:1.1}
    };
    const { container, getByText } = render(
        <Formik>
            <Form>
                <NumericField name="testName" displayName = "Test Name" formProps={fakeFormProps}/>
            </Form>
        </Formik>
    );
    expect(getByText(/Test Name/i)).toBeInTheDocument();
    const formControls = container.getElementsByClassName('form-control');
    expect(formControls.length).toBe(1);
    expect(formControls[0].classList).toContain('modified');
    expect(formControls[0].classList).toContain('valid');
});

test('renders numeric field with validation error', async () => {
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
                <NumericField name="testName" displayName = "Test Name" formProps={fakeFormProps}/>
            </Form>
            
        </Formik>
    );
 
    const input = await screen.findByTestId('num-testName');
    
    act(() =>{
        fireEvent.blur(input);
    })

    expect(input.classList).toContain('invalid');
    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage);
})