import React from 'react';
import { ErrorMessage, useField, FormikProps, getIn } from 'formik';

interface InputProps<T> {
    name: string;
    displayName: string;
    formProps: FormikProps<T>; 
}

const DateField = <T,>(props: InputProps<T>) => {

    const getDateForPicker = (dateString: string) => {
        if(!dateString) {
            return '';
        }
        return dateString.substring(0, 10);
    }

    const [field] = useField(props);
    field.value = getDateForPicker(field.value);

    const { touched, errors, initialValues, values } = props.formProps;
    const isTouched: boolean = getIn(touched, props.name);
    const hasError: boolean = getIn(errors, props.name);
    const initValue: string = getIn(initialValues, props.name);
    const currValue: string = getIn(values, props.name);
    const modifiedClass = isTouched && initValue !== currValue ? 'modified' : '';
    const errorClass = hasError ? 'invalid' : 'valid';
    const fieldClass = `form-control ${modifiedClass} ${errorClass}`;

    return (
        <div className='form-group  my-2'>
            <label htmlFor={props.name}>{props.displayName}</label>
            <input type="date" className={fieldClass} {...field} data-testid={'dte-' + props.name}/>
            <ErrorMessage name={props.name} component="div" className="validation-message" data-testid={'error-' + props.name}/>
        </div>
    );
}

export default DateField;