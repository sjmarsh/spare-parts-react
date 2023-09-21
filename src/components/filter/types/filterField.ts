import { Type } from "typescript";

interface FilterField {
    id: string; // guid
    name: string;
    type: Type | any;
    isSelected: boolean;
    parentFieldName?: string | null;
}

export default FilterField;