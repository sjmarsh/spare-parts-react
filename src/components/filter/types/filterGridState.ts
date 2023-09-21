import FilterField from "./filterField";
import FilterLine from "./filterLine";

interface FilterGridState {
    filterFields: Array<FilterField>;
    filterLines: Array<FilterLine>;
    currentResultPage: number;
    isFieldsSelectionVisible: boolean;
    isFiltersEntryVisible: boolean;
}

export default FilterGridState