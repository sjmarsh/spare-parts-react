import React from 'react';
import { render } from '@testing-library/react';
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


test('renders text field with validation error', () => {
    const fakeFormProps = {
        touched: {testName: true}, 
        errors: {testName: 'Field Name is required'}, 
        initialValues: {testName: null}, 
        values: {testName: null}
    };
    const { container } = render(
        <Formik validate={(values) => {return formProps.errors;}}>
            <Form>
                <TextField name="testName" displayName = "Test Name" formProps={fakeFormProps}/>
            </Form>
        </Formik>
    );
    const formControls = container.getElementsByClassName('form-control');
    expect(formControls.length).toBe(1);
    expect(formControls[0].classList).toContain('invalid');
    const validationMessages = container.getElementsByClassName('validation-message');
    expect(validationMessages.length).toBe(1);
})