import FilterField from "./types/filterField"
import FilterLine from "./types/filterLine"
import FilterFieldType from "./types/filterFieldType";
import GraphQLRequest from "./types/graphQLRequest";
import PageOffset from "./types/pageOffset"
import Environment from "../../app/constants/environment";
import { groupByFunc, groupByKey } from "../../app/helpers/arrayHelper";
import { camelize } from "../../app/helpers/stringHelper";

const AND_FILTER_PREFIX = " and: {";

const valueRequiresQuotes = (filterFieldType: FilterFieldType) : boolean => {
    return filterFieldType === FilterFieldType.StringType || filterFieldType == FilterFieldType.DateType;
}

const getFilterLineValue = (filterLine: FilterLine) : string => {
    if(filterLine.selectedField.type === FilterFieldType.EnumType) {
        return filterLine.value.toUpperCase();
    }
    if(valueRequiresQuotes(filterLine.selectedField.type)) {
        return `"${filterLine.value}"`;
    }
    return filterLine.value;
}

const getFilterString = (filterLine: FilterLine) : string => {
    const filterLineValue = getFilterLineValue(filterLine);
    return ` ${camelize(filterLine.selectedField.name)}: { ${filterLine.selectedOperator}: ${filterLineValue} }`;
}

const buildQueryFilterComponents = (filterLines: Array<FilterLine>, filter: string, isParent: boolean) => {
    if(!filterLines || filterLines.length === 0){
        return filter;
    }

    if(filterLines.length === 1) {
        if(isParent) {
            filter = getFilterString(filterLines[0]);
        }
        else {
            filter += getFilterString(filterLines[0]);
        }
    }
    else {
        let filterComponent = "";
        filterLines.forEach(filterLine => {
            filterComponent += `${AND_FILTER_PREFIX}${getFilterString(filterLine)}`;
        });
        filterComponent = filterComponent.slice(AND_FILTER_PREFIX.length, filterComponent.length);
        filter += filterComponent;
    }

    return filter;
}

const buildQueryFilter = (filterLines: Array<FilterLine>) => {
    let filter = "";    
    if(filterLines && filterLines.length > 0) {
        filter = buildQueryFilterComponents(filterLines.filter(f => f.selectedField.parentFieldName === null || f.selectedField.parentFieldName === undefined), filter, true);
        const groupedChildFilterFields = groupByFunc(filterLines.filter(f => f.selectedField.parentFieldName), (filter) => filter.selectedField.parentFieldName ?? "");
        groupedChildFilterFields.forEach(grp => {
            const prefix = filter.length > 0 ? AND_FILTER_PREFIX : "";
            let childFilter = ` ${prefix} ${camelize(grp.key)}: { some: { `;
            childFilter = buildQueryFilterComponents(grp.values, childFilter, false);
            childFilter += "}}";
            filter += childFilter;
        });
        
        // build end braces
        for(let i = 0; i < filterLines.length -1; i++) {
            filter += "}";
        }
    }
    return filter;
}

const buildFilterFields = (filterFields: Array<FilterField>, isParentLevel: boolean) : string => {
    
    let filterFieldString = "";
    if(filterFields && filterFields.length > 0) {
        filterFields.filter(f => f.isSelected && (!(f.parentFieldName && f.parentFieldName.length > 0) === isParentLevel)).forEach(filter => { 
            filterFieldString += filter.name + Environment.NewLine;
        })
    }
    return filterFieldString;
}

const buildParentLevelFilterFields = (filterFields: Array<FilterField>) : string => {
    return buildFilterFields(filterFields, true);
}

const buildChildLevelFilterFields = (filterFields: Array<FilterField>) : string => {
    let childFilterString = "";
    var groupedChildFilterFields = groupByKey(filterFields.filter(f => f.parentFieldName && f.parentFieldName.length > 0), "parentFieldName");

    groupedChildFilterFields.forEach(grp => {
        childFilterString += camelize(grp.key) + Environment.NewLine;
        childFilterString += "{" + Environment.NewLine;
        childFilterString += buildFilterFields(grp.values, false) + Environment.NewLine;
        childFilterString += "}" + Environment.NewLine;
    });

    return childFilterString;
}

const build = (filterLines: Array<FilterLine>, filterFields: Array<FilterField>, rootGraphQLField? : string | null, pageOffset?: PageOffset | null) : GraphQLRequest => {

    const isPagingEnabled = pageOffset !== null;
    const filter = buildQueryFilter(filterLines);

    const parentLevelFields = buildParentLevelFilterFields(filterFields);
    const childLevelFields = buildChildLevelFilterFields(filterFields);

    const fields = parentLevelFields + childLevelFields;

    const sortOrder = `, order:[{${camelize(filterFields[0].name)}: ASC }]`;
    const filterPageOffset = (pageOffset) ? `, skip: ${pageOffset.skip}, take: ${pageOffset.take}` : "";
    const pagingItemsStart = isPagingEnabled ? "items {" : "";
    const pagingItemsEnd = isPagingEnabled ? `} 
    pageInfo {
        hasNextPage
    }
    totalCount
    ` : "";

    return {
        query: `{
            ${rootGraphQLField} (where: { ${filter}}${sortOrder}${filterPageOffset}) {
                ${pagingItemsStart}
                ${fields}
                ${pagingItemsEnd}
            }
        }`
    } as GraphQLRequest
}

export {
    build as buildGraphQLRequest
}