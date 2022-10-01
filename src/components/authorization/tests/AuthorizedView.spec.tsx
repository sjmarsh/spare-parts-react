import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import AuthorizedView from '../AuthorizedView';

const authHelper = require('../authrorizationHelper');
const hooks = require('../../../app/hooks');


describe('AuthorizedView', () => {
    
    const message: string = "I'm Authroized";
    
    it('should render child when user is authenticated and has required roles', () => {
        hooks.useAppSelector = vi.fn(() => true);
        authHelper.userHasRequiredRoles = vi.fn(() => true);

        render(
            <AuthorizedView>
                <div>{message}</div>
            </AuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    });

    it('should not render child when user is authenticated but does not have required roles', () => {
        hooks.useAppSelector = vi.fn(() => true);
        authHelper.userHasRequiredRoles = vi.fn(() => false);

        render(
            <AuthorizedView>
                <div>{message}</div>
            </AuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });

    it('should not render child when user is not authenticated', () => {
        hooks.useAppSelector = vi.fn(() => false);
        authHelper.userHasRequiredRoles = vi.fn(() => true); // this should never happen but testing just in case

        render(
            <AuthorizedView>
                <div>{message}</div>
            </AuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });

    it('should not render child when user is not authenticated and user does not have required roles', () => {
        hooks.useAppSelector = vi.fn(() => false);
        authHelper.userHasRequiredRoles = vi.fn(() => false);

        render(
            <AuthorizedView>
                <div>{message}</div>
            </AuthorizedView> 
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });
});