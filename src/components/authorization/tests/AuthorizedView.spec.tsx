import { render, screen } from '@testing-library/react';

import AuthorizedView from '../AuthorizedView';

const authHelper = require('../authrorizationHelper');
const hooks = require('../../../app/hooks');


describe('AuthorizedView', () => {
    
    const message: string = "I'm Authroized";
    
    it('should render child when user is authenticated and has required roles', () => {
        hooks.useAppSelector = jest.fn(() => true);
        authHelper.userHasRequiredRoles = jest.fn(() => true);

        render(
            <AuthorizedView>
                <div>{message}</div>
            </AuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    });

    it('should not render child when user is authenticated but does not have required roles', () => {
        hooks.useAppSelector = jest.fn(() => true);
        authHelper.userHasRequiredRoles = jest.fn(() => false);

        render(
            <AuthorizedView>
                <div>{message}</div>
            </AuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });

    it('should not render child when user is not authenticated', () => {
        hooks.useAppSelector = jest.fn(() => false);
        authHelper.userHasRequiredRoles = jest.fn(() => true); // this should never happen but testing just in case

        render(
            <AuthorizedView>
                <div>{message}</div>
            </AuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });

    it('should not render child when user is not authenticated and user does not have required roles', () => {
        hooks.useAppSelector = jest.fn(() => false);
        authHelper.userHasRequiredRoles = jest.fn(() => false);

        render(
            <AuthorizedView>
                <div>{message}</div>
            </AuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });
});