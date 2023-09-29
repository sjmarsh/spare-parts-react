import React from "react";
import { Field, ErrorMessage, FormikProps, useFormikContext, getIn } from 'formik';

interface InputProps<T> {
    name: string;
    displayName: string;
    selectOptions: string[];
    formProps: FormikProps<T>; 
}

const SelectField = <T,>(props: InputProps<T>) => {
    const { touched, errors, initialValues, values } = props.formProps;
    
    const isTouched: boolean = getIn(touched, props.name);
    const hasError: boolean = getIn(errors, props.name);
    const initValue: string = getIn(initialValues, props.name);
    const currValue: string = getIn(values, props.name);
    const modifiedClass = isTouched && initValue !== currValue ? 'modified' : '';
    const errorClass = hasError ? 'invalid' : 'valid';
   
    const fieldClass = `form-control ${modifiedClass} ${errorClass}`;

    const { setFieldValue } = useFormikContext(); 
    
    const handleThis = (newValue: string | null) => {
        if(newValue === ''){
            setFieldValue(props.name, null);
        }
        else {
            setFieldValue(props.name, newValue);
        }
    }

    return (
        <div className='form-group  my-2'>
            <label htmlFor={props.name} aria-labelledby={props.name}>{props.displayName}</label>
            
            <Field as="select" id={props.name} name={props.name} className={fieldClass} aria-label={props.name} 
                onChange={(e: any) => handleThis(e.target.value)} value={props.formProps.getFieldProps(props.name).value ?? ""}>
                <option value={''}></option>
                { 
                    props.selectOptions.map((key, index) => 
                    <option key={index}>{key}</option>
               )}
            </Field>
            <ErrorMessage name={props.name} component="div" className="validation-message" data-testid={'error-' + props.name} />
        </div>
    );
};

export default SelectField;