import React from 'react';
import { ErrorMessage, useField } from 'formik';

const DateField = (props) => {

    const getDateForPicker = (dateString) => {
        if(!dateString) {
            return '';
        }
        return dateString.substring(0, 10);
    }

    const [field] = useField(props);
    field.value = getDateForPicker(field.value);

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
            <input name={props.name} type="date" className={fieldClass} {...field} />
            <ErrorMessage name={props.name} component="div" className="validation-message"/>
        </div>
    );
}

export default DateField;