import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import { test, expect } from 'vitest';

import NumericField from '../NumericField';

interface TestObject {
    testName: number;
}

test('renders numeric field', async () => {
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
    // ref: avoid formik update warnings https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    
    const input = await screen.findByRole('textbox', {name: 'testName'});
    expect (input).toBeInTheDocument();
    expect (input).not.toHaveClass('modified'); 
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
    
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    
    let input = await screen.findByRole('textbox', {name: 'testName'});
        
    fireEvent.blur(input);
    fireEvent.change(input, {target: {value: 123}});  // NOTE: Still using fireEvent here (instead of userEvent) due to issue where userEvent.type not picking up changed value for numeric input
 
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    input = await screen.findByRole('textbox', {name: 'testName'});
    expect(input.classList.contains('valid')).toBeTruthy();
    expect(input.classList.contains('modified')).toBeTruthy();
});

test('renders numeric field with validation error', async () => {
    const errorMessage = 'Required';
    const formdata: TestObject = { testName: 0 };
    const user = userEvent.setup();

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
     
    await waitFor(() => { expect(screen.getByText(/Test Name/i)).toBeInTheDocument(); });
    let input = await screen.findByRole('textbox', {name: 'testName'});
    
    await user.type(input, '-2');
    
    let updatedInput = await screen.findByLabelText('Test Name');
    await waitFor(() => {
        expect(updatedInput.classList.contains('invalid')).toBeTruthy();
    });
    
    await user.tab();

    const validationMessage = await screen.findByTestId('error-testName');
    expect(validationMessage.innerHTML).toBe(errorMessage); 
});