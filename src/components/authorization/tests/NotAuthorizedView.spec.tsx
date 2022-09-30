import { render, screen } from '@testing-library/react';

import NotAuthorizedView from '../NotAuthorizedView';

const authHelper = require('../authrorizationHelper');
const hooks = require('../../../app/hooks');

describe('NotAuthorizedView', () => {
    
    const message: string = "I'm Not Authroized";
    
    it('should not render child when user is authenticated and has required roles', () => {
        hooks.useAppSelector = jest.fn(() => true);
        authHelper.userHasRequiredRoles = jest.fn(() => true);

        render(
            <NotAuthorizedView>
                <div>{message}</div>
            </NotAuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });

    it('should render child when user is authenticated but does not have required roles', () => {
        hooks.useAppSelector = jest.fn(() => true);
        authHelper.userHasRequiredRoles = jest.fn(() => false);

        render(
            <NotAuthorizedView>
                <div>{message}</div>
            </NotAuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    });

    it('should render child when user is not authenticated', () => {
        hooks.useAppSelector = jest.fn(() => false);
        authHelper.userHasRequiredRoles = jest.fn(() => true); // this should never happen but testing just in case

        render(
            <NotAuthorizedView>
                <div>{message}</div>
            </NotAuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    });

    it('should render child when user is not authenticated and user does not have required roles', () => {
        hooks.useAppSelector = jest.fn(() => false);
        authHelper.userHasRequiredRoles = jest.fn(() => false);

        render(
            <NotAuthorizedView>
                <div>{message}</div>
            </NotAuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    });
});