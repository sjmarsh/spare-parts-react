import React from "react";
import { Field, ErrorMessage } from 'formik';

const TextField = (props) => {
    const { touched, errors, initialValues, values } = props.formProps;
    const isTouched = touched[props.name];
    const hasError = errors[props.name];
    const initValue = initialValues[props.name];
    const currValue = values[props.name];
    const modifiedClass = isTouched && initValue !== currValue ? 'modified' : '';
    const errorClass = hasError ? 'invalid' : 'valid';
  
    const fieldClass = `form-control ${modifiedClass} ${errorClass}`;

    return (
        <div className='form-group  my-2'>
            <label htmlFor={props.name}>{props.displayName}</label>
            <Field type="string" name={props.name} className={fieldClass} data-testid={'txt-' + props.name}/>
            <ErrorMessage name={props.name} component="div" className="validation-message" data-testid={'error-' + props.name} />
        </div>
    );
};

export default TextField;