import FieldChipColor from "./fieldChipColor";
import FilterField from "./filterField";
import FilterLine from "./filterLine";
import { PagedData } from "./pagedData";

interface FilterGridState<T> {
    filterFields: Array<FilterField>;
    filterLines: Array<FilterLine>;
    currentResultPage: number;
    isFieldsSelectionVisible: boolean;
    isFiltersEntryVisible: boolean;
    chipColors: Array<FieldChipColor>;
    filterResults?: PagedData<T> | null;
}

export default FilterGridState