import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik, Form } from 'formik';

import DateField from '../DateField';

interface TestObject {
    testName: string;
}

test('renders date field', () => {
    const formdata: TestObject = { testName: '' };
    const { container, getByText } = render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <DateField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    expect(getByText(/Test Name/i)).toBeInTheDocument();
    const formControls = container.getElementsByClassName('form-control');
    expect(formControls.length).toBe(1);
    expect(formControls[0].classList).not.toContain('modified');
})

test('renders date field with modified', async () => {
    const formdata: TestObject = { testName: "" };
    render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <DateField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    
    expect(await screen.findByTestId('dte-testName')).toBeInTheDocument();
    let input = await screen.findByTestId('dte-testName');
    
    act(() =>{
        fireEvent.blur(input);
        fireEvent.change(input, {target: {value: "2020-01-01"}});
    })

    input = await screen.findByTestId('dte-testName');
    await waitFor(() => {
        expect(input.classList).toContain('valid');
        expect(input.classList).toContain('modified');    
    });
});

test('renders date field with validation error', async () => {
    const errorMessage = 'Required';
    const formdata: TestObject = { testName: "" };
    
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
                    <DateField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
 
    expect(await screen.findByTestId('dte-testName')).toBeInTheDocument();
    let input = await screen.findByTestId('dte-testName');
    
    act(() =>{
        fireEvent.blur(input);
    });

    input = await screen.findByTestId('dte-testName');
    await waitFor(() => {
        expect(input.classList).toContain('invalid');    
    });
    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage); 
})