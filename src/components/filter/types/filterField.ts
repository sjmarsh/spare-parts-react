import { Type } from "typescript";
import WithId from "../../../app/types/withId";

interface FilterField extends WithId {
    id: string; // guid
    name: string;
    type: Type | any;
    isSelected: boolean;
    parentFieldName?: string | null;
}

export default FilterField;