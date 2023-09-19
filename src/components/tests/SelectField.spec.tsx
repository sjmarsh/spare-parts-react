import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form } from 'formik';
import { test, expect } from 'vitest';

import SelectField from '../SelectField';

interface TestObject {
    testSelection: string;
}

test('renders select field', async () => {
        
    const formdata: TestObject = { testSelection: "" };
    render(
        <Formik initialValues={formdata} onSubmit={()=> {}}>
            {(props) => {
            return (
                <Form>
                    <SelectField name="testSelection" displayName = "Test Selection" selectOptions={new Array("One", "Two", "Three")} formProps={props}/>
                </Form>
            )}}
        </Formik>
    );

    // ref: avoid formik update warnings https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
    await waitFor(() => { expect(screen.getByText(/Test Selection/i)).toBeInTheDocument(); });
    
    const input = await screen.findByRole('combobox', {name: 'testSelection'});
    expect (input).toBeInTheDocument();
    expect (input).not.toHaveClass('modified'); 
});

test('renders select field with modified', async () => {
    const formdata: TestObject = { testSelection: "" };
    const user = userEvent.setup();
        
    render(
        <Formik 
            initialValues={formdata} 
            onSubmit={()=> {}} 
            validate={(values) => {
                let errors: any = {};
                if(values?.testSelection == ""){
                    errors.testName = "error";
                }
                return errors;
            }}>
            {(props) => {     
            return (
                <Form>
                    <SelectField name="testSelection" displayName = "Test Selection" selectOptions={new Array("One", "Two", "Thee")} formProps={props}/>
                </Form>
            )}}
        </Formik>
    );
    
    await waitFor(() => { expect(screen.getByText(/Test Selection/i)).toBeInTheDocument(); });
    let input = await screen.findByRole('combobox', {name: 'testSelection'});
    
    await user.selectOptions(input, "Two");
    
    let updatedInput = await screen.findByLabelText('Test Selection');
    await user.tab();
    await waitFor(() => {
        expect(updatedInput.classList.contains('valid')).toBeTruthy();
    });
    
    expect(input.classList.contains('valid')).toBeTruthy();
    expect(input.classList.contains('modified')).toBeTruthy();
});
