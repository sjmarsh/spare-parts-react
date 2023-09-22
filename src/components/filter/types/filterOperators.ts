enum FilterOperator {
    Equal = "eq",
    NotEqual = "neq",
    Contains = "contains",
    GreaterThan = "gt",
    GreatherThanOrEqual = "gte",
    LessThan = "lt",
    LessThanOrEqual = "lte",
    StartsWith = "startsWith",
    EndsWith = "endsWith",
}

interface NamedFilterOperator {
    name: string;
    filterOperator: string;
}

const namedFilterOperators = () : Array<NamedFilterOperator> => {
    var operators = Object.entries(FilterOperator);
    return operators.map((op) => { return { name: op[0], filterOperator: op[1] } as NamedFilterOperator });
}

export {
    FilterOperator,
    NamedFilterOperator,
    namedFilterOperators
}