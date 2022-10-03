/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { test, expect } from 'vitest';

import DateField from '../DateField';

interface TestObject {
    testName: string;
}

test('renders date field', async() => {
    const formdata: TestObject = { testName: '' };
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

    // ref: avoid formik update warnings https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });

    const input = await screen.findByLabelText('Test Name');
    expect (input).toBeInTheDocument();
    expect (input).not.toHaveClass('modified'); 
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
    
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });

    let input = await screen.findByLabelText('Test Name');
        
    fireEvent.blur(input);
    fireEvent.change(input, {target: {value: "2020-01-01"}});
 
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    input = await screen.findByLabelText('Test Name');
    expect(input.classList.contains('valid')).toBeTruthy();
    expect(input.classList.contains('modified')).toBeTruthy();
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
 
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    let input = await screen.findByLabelText('Test Name');
    
    fireEvent.blur(input);
    
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    input = await screen.findByLabelText('Test Name');
    expect(input.classList.contains('invalid')).toBeTruthy();
    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage); 
});