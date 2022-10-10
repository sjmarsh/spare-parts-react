import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const user = userEvent.setup();

    render(
        <Formik initialValues={formdata} 
                onSubmit={()=> {}}
                validate={(values) => {
                    let errors: any = {};
                    if(values?.testName == "1990-01-01"){
                        errors.testName = "error";
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
  
    await user.type(input, "01/01/2022");
    await user.tab();

    let updatedInput = await screen.findByLabelText('Test Name');
    await waitFor(() => {
        expect(updatedInput.classList.contains('valid')).toBeTruthy();
    });
    
    expect(input.classList.contains('valid')).toBeTruthy();
});

test('renders date field with validation error', async () => {
    const errorMessage = 'Required';
    const invalidValue = '2020-01-01';
    const formdata: TestObject = { testName: "" };
    const user = userEvent.setup();
    
    render(
        <Formik 
            initialValues={formdata} 
            onSubmit={()=> {}} 
            validate={(values) => {
                let errors: any = {};
                if(values?.testName == invalidValue){
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
  
    await user.type(input, invalidValue);
    await user.tab();
    let updatedInput = await screen.findByLabelText('Test Name');
    await waitFor(() => {
        expect(updatedInput.classList.contains('invalid')).toBeTruthy();
    });
        
    expect(input.classList.contains('valid')).toBeFalsy();
    expect(input.classList.contains('modified')).toBeTruthy();
    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage); 
       
});