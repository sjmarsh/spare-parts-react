interface AuthorizeProps {
    roles?: Array<string> | null,
    doRoleCheck?: boolean,
    children: JSX.Element | null
}

export default AuthorizeProps;