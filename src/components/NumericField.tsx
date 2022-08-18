import React  from "react";
import { ErrorMessage, useField, useFormikContext, FormikProps, getIn } from 'formik';
import NumberFormat, { NumberFormatValues } from 'react-number-format';

interface InputProps<T> {
    name: string;
    displayName: string;
    formProps: FormikProps<T>; 
}

const NumericField = <T,>(props: InputProps<T>) => {
    const { touched, errors, initialValues, values } = props.formProps;
    
    const isTouched: boolean = getIn(touched, props.name);
    const hasError: boolean = getIn(errors, props.name);
    const initValue: string = getIn(initialValues, props.name);
    const currValue: string = getIn(values, props.name);
    const modifiedClass = isTouched && initValue !== currValue ? 'modified' : '';
    const errorClass = hasError ? 'invalid' : 'valid';
    const fieldClass = `form-control ${modifiedClass} ${errorClass}`;

    const { setFieldValue } = useFormikContext(); 
    const [field] = useField(props);
    const handleThis = (e: NumberFormatValues) => {
        setFieldValue(props.name, e.floatValue);
    }

    return (
        <div className='form-group  my-2'>
            <label htmlFor={props.name}>{props.displayName}</label>
            <NumberFormat className={fieldClass} {...field} 
                displayType="input" isNumericString={true} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} 
                onValueChange={(e) => handleThis(e)} data-testid={'num-' + props.name}/>
            <ErrorMessage name={props.name} component="div" className="validation-message" data-testid={'error-' + props.name}/>
        </div>
    );
};

export default NumericField;