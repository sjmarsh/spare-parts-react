import ChipColor from "../../chips/types/chipColor";
import FieldChipColor from "./fieldChipColor";
import FilterField from "./filterField";
import FilterLine from "./filterLine";

interface FilterGridState {
    filterFields: Array<FilterField>;
    filterLines: Array<FilterLine>;
    currentResultPage: number;
    isFieldsSelectionVisible: boolean;
    isFiltersEntryVisible: boolean;
    chipColors: Array<FieldChipColor>;
}

export default FilterGridState