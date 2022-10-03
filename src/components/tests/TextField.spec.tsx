/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { test, expect } from 'vitest';

import TextField from '../TextField';

interface TestObject {
    testName: string;
}

test('renders text field', async () => {
        
    const formdata: TestObject = { testName: "" };
    render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <TextField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );

    // ref: avoid formik update warnings https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    
    const input = await screen.findByRole('textbox', {name: 'testName'});
    expect (input).toBeInTheDocument();
    expect (input).not.toHaveClass('modified'); 
});

test('renders password field', async() => {
    const formdata: TestObject = { testName: "" };
    render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <TextField name="testName" displayName = "Test Name" isPassword={true} formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    
    const input = screen.getByLabelText(/Test Name/i);
    expect (input).toBeInTheDocument();
    expect (input).toHaveAttribute('type', 'password');
    expect (input).not.toHaveClass('modified'); 
});

test('renders text field with modified', async () => {
    const formdata: TestObject = { testName: "" };
    render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <TextField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    
    let input = await screen.findByRole('textbox', {name: 'testName'});
        
    fireEvent.blur(input);
    fireEvent.change(input, {target: {value: "abc"}});
 
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
        
    input = await screen.findByRole('textbox', {name: 'testName'});
    expect(input.classList.contains('valid')).toBeTruthy();
    expect(input.classList.contains('modified')).toBeTruthy();
    //await waitFor(() => { expect(input.classList).toContain('valid'); });
    //expect(input.classList).toContain('modified');    
});

test('renders text field with validation error', async () => {
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
                    <TextField name="testName" displayName = "Test Name" formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    let input = await screen.findByRole('textbox', {name: 'testName'});
    
    input.innerText = 'abc';
    input.innerText = '';
    
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    input = await screen.findByRole('textbox', {name: 'testName'});
    //await waitFor(() => { expect(input.classList).toContain('invalid'); });
    expect(input.classList.contains('invalid')).toBeTruthy();
    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage); 
});
