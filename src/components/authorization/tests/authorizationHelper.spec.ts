import { userHasRequiredRoles } from '../authrorizationHelper';
import { describe, it, expect } from 'vitest';

describe('authorizationHelper', () => {

    it('should have required roles', () => {
        const requiredRoles = ['Admin', 'User'];
        const userRoles = ['User'];

        const result = userHasRequiredRoles(requiredRoles, userRoles)

        expect(result).toBeTruthy();
    });

    it('should have required roles when there are no required roles', () => {
        const requiredRoles = [] as Array<string>;
        const userRoles = ['User'];

        const result = userHasRequiredRoles(requiredRoles, userRoles)

        expect(result).toBeTruthy();
    });

    it('should have required roles when required roles has not been set', () => {
        const requiredRoles = null;
        const userRoles = ['User'];

        const result = userHasRequiredRoles(requiredRoles, userRoles)

        expect(result).toBeTruthy();
    });

    it('should not have required roles', () => {
        const requiredRoles = ['Admin', 'User'];
        const userRoles = ['Guest'];

        const result = userHasRequiredRoles(requiredRoles, userRoles)

        expect(result).toBeFalsy();
    });

    it('should not have required roles when user has no roles', () => {
        const requiredRoles = ['Admin', 'User'];
        const userRoles = [] as Array<string>;

        const result = userHasRequiredRoles(requiredRoles, userRoles)

        expect(result).toBeFalsy();
    });

    it('should not have required roles when user roles not set', () => {
        const requiredRoles = ['Admin', 'User'];
        const userRoles = null;

        const result = userHasRequiredRoles(requiredRoles, userRoles)

        expect(result).toBeFalsy();
    });
});