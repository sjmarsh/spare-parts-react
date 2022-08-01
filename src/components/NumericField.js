import React  from "react";
import { ErrorMessage, useField, useFormikContext } from 'formik';
import NumberFormat from 'react-number-format';

const NumericField = (props) => {

    const { touched, errors, initialValues, values } = props.formProps;
    const isTouched = touched[props.name];
    const hasError = errors[props.name];
    const initValue = initialValues[props.name];
    const currValue = values[props.name];
    const modifiedClass = isTouched && initValue !== currValue ? 'modified' : '';
    const errorClass = hasError ? 'invalid' : 'valid';
    const fieldClass = `form-control ${modifiedClass} ${errorClass}`;

    const { setFieldValue } = useFormikContext(); 
    const [field] = useField(props);
    const handleThis = (e) =>{
        setFieldValue(e.floatValue);
    }

    return (
        <div className='form-group  my-2'>
            <label htmlFor={props.name}>{props.displayName}</label>
            <NumberFormat name={props.name} className={fieldClass} {...field} 
                displayType='number' isNumericString={true} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} 
                onValueChange={(e) => handleThis(e)} data-testid={'num-' + props.name}/>
            <ErrorMessage name={props.name} component="div" className="validation-message" data-testid={'error-' + props.name}/>
        </div>
    );
};

export default NumericField;