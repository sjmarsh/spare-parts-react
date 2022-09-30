const userHasRequiredRoles = ( requiredRoles: Array<string> | null, usersRoles: Array<string> | null) => {
    if(!requiredRoles || requiredRoles.length === 0)
        return true;

    const intersectingRoles  = usersRoles?.filter(x => requiredRoles?.includes(x));
    return (intersectingRoles && intersectingRoles.length > 0) ? true : false;
}

export {
    userHasRequiredRoles
};