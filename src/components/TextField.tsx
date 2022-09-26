import React from "react";
import { Field, ErrorMessage, FormikProps, getIn } from 'formik';

interface InputProps<T> {
    name: string;
    displayName: string;
    isPassword?: boolean | null;
    formProps: FormikProps<T>; 
}

const TextField = <T,>(props: InputProps<T>) => {
    const { touched, errors, initialValues, values } = props.formProps;
    
    const isTouched: boolean = getIn(touched, props.name);
    const hasError: boolean = getIn(errors, props.name);
    const initValue: string = getIn(initialValues, props.name);
    const currValue: string = getIn(values, props.name);
    const modifiedClass = isTouched && initValue !== currValue ? 'modified' : '';
    const errorClass = hasError ? 'invalid' : 'valid';
  
    const fieldType = props.isPassword ? 'password' : 'text';
    const fieldClass = `form-control ${modifiedClass} ${errorClass}`;

    return (
        <div className='form-group  my-2'>
            <label htmlFor={props.name} aria-labelledby={props.name}>{props.displayName}</label>
            <Field type={fieldType} id={props.name} name={props.name} className={fieldClass} aria-label={props.name} />
            <ErrorMessage name={props.name} component="div" className="validation-message" data-testid={'error-' + props.name} />
        </div>
    );
};

export default TextField;