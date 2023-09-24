import React, {useState, useEffect} from "react";

import humanizeString from "humanize-string";

import FilterField from "./types/filterField";
import FilterLine from "./types/filterLine";
import { namedFilterOperators, namedFilterOperatorsForDatesAndNumbers, nameFilterOperatorsForStrings } from "./types/filterOperators";
import FilterFieldType from "./types/filterFieldType";

interface inputProps {
    fields: Array<FilterField>,
    filterLine: FilterLine,
    onFilterLineChanged?: (filterLine: FilterLine) => void | null;
    onRemoveFilter?: (filterLine: FilterLine) => void | null;
}

const FilterSelector = (props: inputProps) => {

    const getDefaultFields = () : Array<FilterField> => {
        return props.fields.map((field) => { 
            return { id: field.id, name: field.name, type: field.type, isSelected: field.isSelected, parentFieldName: field.parentFieldName } as FilterField });
    }

    const [filterLine, setFilterLine] = useState(props.filterLine);
    const [fields, setFields] = useState(getDefaultFields());
    const [operators, setOperators] = useState(namedFilterOperators());
   
    useEffect(() => {
        updateOperators(props.filterLine.selectedField);
    }, [filterLine])

    const updateOperators = (selectedField?: FilterField) => {
        if(selectedField && selectedField.type === FilterFieldType.DateOrNumber) {
            setOperators(namedFilterOperatorsForDatesAndNumbers());
        }
        else {
            setOperators(nameFilterOperatorsForStrings());
        }
    }

    const handleFieldChanged = (fieldId: string) => {
        const selectedField = fields.find(f => f.id === fieldId);
        if(selectedField) {
            const state = {...filterLine, selectedField: selectedField};
            setFilterLine(state);
            if(props.onFilterLineChanged){
                props.onFilterLineChanged(state);
            }
        }        
    }

    const handleOperatorChanged = (operator: string) => {
        const state = {...filterLine, selectedOperator: operator};
        if(props.onFilterLineChanged){
            props.onFilterLineChanged(state);
        }
        setFilterLine(state);
    }

    const handleValueChanged = (newValue: string) => {
        const state = {...filterLine, value: newValue};
        if(props.onFilterLineChanged){
            props.onFilterLineChanged(state);
        }
        setFilterLine(state);
    }

    const handleRemoveFilter = () => {
        if(props.onRemoveFilter) {
            props.onRemoveFilter(filterLine);
        }
    }

    return(
        props.fields && 
        <div className="row mt-2" >
            
            <div className="col">
                
                <div className="form-group my-2">
                    <select id={`field-${filterLine.id}`} className="form-select valid" value={filterLine.selectedField.id} onChange={f => handleFieldChanged(f.target.value)}>
                    {fields.map((field, index) => (
                        <option value={field.id} key={index}>{humanizeString(field.name)}</option>
                    ))}
                    </select>
                </div>
            </div>

            <div className="col">
                <div className="form-group my-2">
                    <select id={`operator-${filterLine.id}`} className="form-select valid" value={filterLine.selectedOperator} onChange={o => handleOperatorChanged(o.target.value)}>
                    {operators.map((op, index) => (
                        <option value={op.filterOperator} key={index}>{humanizeString(op.name)}</option>
                    ))}
                    </select>
                </div>
            </div>

            <div className="col">
                <div className="form-group my-2">
                    <input id={`value-${filterLine.id}`} type="text" className="form-control valid" value={filterLine.value} onChange={v => handleValueChanged(v.target.value)} />
                </div>
            </div>

            <div className="col">
                <div className="form-group my-2">
                    <a id={`remove-${filterLine.id}`} onClick={handleRemoveFilter}><span className="oi oi-x"></span></a>
                </div>
            </div>

        </div>
    );
}

export default FilterSelector;