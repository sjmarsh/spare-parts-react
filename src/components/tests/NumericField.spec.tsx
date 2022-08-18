import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik, Form } from 'formik';

import NumericField from '../NumericField';

interface TestObject {
    testName: number;
}

test('renders numeric field', () => {
    const formdata: TestObject = { testName: 0 };
    const { container, getByText } = render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <NumericField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    expect(getByText(/Test Name/i)).toBeInTheDocument();
    const formControls = container.getElementsByClassName('form-control');
    expect(formControls.length).toBe(1);
    expect(formControls[0].classList).not.toContain('modified');
})

test('renders numeric field with modified', async () => {
    const formdata: TestObject = { testName: 0 };
    render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <NumericField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    
    expect(await screen.findByTestId('num-testName')).toBeInTheDocument();
    let input = await screen.findByTestId('num-testName');
    
    act(() =>{
        fireEvent.blur(input);
        fireEvent.change(input, {target: {value: 2}});
    })

    input = await screen.findByTestId('num-testName');
    await waitFor(() => {
        expect(input.classList).toContain('valid');
        expect(input.classList).toContain('modified');    
    });
});

test('renders numeric field with validation error', async () => {
    const errorMessage = 'Required';
    const formdata: TestObject = { testName: 0 };

    render(
        <Formik 
            initialValues={formdata} 
            onSubmit={()=> {}} 
            validate={(values) => {
                let errors: any = {};
                if(!values?.testName || values?.testName < 1){
                    errors.testName = errorMessage;
                }
                return errors;
            }}>
            {(props) => {     
            return (
                <Form>
                    <NumericField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
 
    expect(await screen.findByTestId('num-testName')).toBeInTheDocument();
    let input = await screen.findByTestId('num-testName');
    
    act(() =>{
        fireEvent.blur(input);
    });

    input = await screen.findByTestId('num-testName');
    await waitFor(() => {
        expect(input.classList).toContain('invalid');    
    });
    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage); 
});