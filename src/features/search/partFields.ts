import FilterField from "../../components/filter/types/filterField"
import FilterFieldType from "../../components/filter/types/filterFieldType";

import { getUUid } from '../../app/helpers/uuidHelper';

const partFields = () : Array<FilterField> => {
    return new Array<FilterField>(
        { id: getUUid(), name: "name", type: FilterFieldType.StringType, isSelected: true },
        { id: getUUid(), name: "description", type: FilterFieldType.StringType, isSelected: true },
        { id: getUUid(), name: "category", type: FilterFieldType.EnumType, isSelected: true },
        { id: getUUid(), name: "weight", type: FilterFieldType.DateOrNumber, isSelected: true },
        { id: getUUid(), name: "price", type: FilterFieldType.DateOrNumber, isSelected: true },
        { id: getUUid(), name: "startDate", type: FilterFieldType.DateOrNumber, isSelected: true },
        { id: getUUid(), name: "endDate", type: FilterFieldType.DateOrNumber, isSelected: true }
    );
}

export { partFields };