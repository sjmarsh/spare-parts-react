import React, {useState} from "react";

import humanizeString from "humanize-string";

import FilterField from "./types/filterField";
import FilterLine from "./types/filterLine";
import { namedFilterOperators } from "./types/filterOperators";

interface inputProps {
    fields: Array<FilterField>,
    filterLine: FilterLine,
    onFilterLineChanged?: (filterLine: FilterLine) => void | null; 
}

const FilterSelector = (props: inputProps) => {

    const getDefaultFields = () : Array<FilterField> => {
        return props.fields.map((field) => { 
            return { id: field.id, name: field.name, type: field.type, isSelected: field.isSelected, parentFieldName: field.parentFieldName } as FilterField });
    }

    const [filterLine, setFilterLine] = useState(props.filterLine);
    const [fields, setFields] = useState(getDefaultFields());
    const [operators, setOperators] = useState(namedFilterOperators());
   
    const handleFieldChanged = (fieldId: string) => {
        const selectedField = fields.find(f => f.id === fieldId);
        if(selectedField) {
            setFilterLine({...filterLine, selectedField: selectedField});
        }        
    }

    const handleOperatorChanged = (operator: string) => {
        setFilterLine({...filterLine, selectedOperator: operator});
    }

    const handleValueChanged = (newValue: string) => {
        setFilterLine({...filterLine, value: newValue})
    }

    return(
        props.fields && 
        <div className="row mt-2" >
            
            <div className="col">
                
                <div className="form-group my-2">
                    <select id="field" className="form-select valid" value={filterLine.selectedField.id} onChange={f => handleFieldChanged(f.target.value)}>
                    {fields.map((field, index) => (
                        <option value={field.id} key={index}>{humanizeString(field.name)}</option>
                    ))}
                    </select>
                </div>
            </div>

            <div className="col">
                <div className="form-group my-2">
                    <select id="operator" className="form-select valid" value={filterLine.selectedOperator} onChange={o => handleOperatorChanged(o.target.value)}>
                    {operators.map((op, index) => (
                        <option value={op.filterOperator} key={index}>{humanizeString(op.name)}</option>
                    ))}
                    </select>
                </div>
            </div>

            <div className="col">
                <div className="form-group my-2">
                    <input id="value" type="text" className="form-control valid" value={filterLine.value} onChange={v => handleValueChanged(v.target.value)} />
                </div>
            </div>

        </div>
    );
}

export default FilterSelector;