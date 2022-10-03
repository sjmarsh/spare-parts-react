import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import NotAuthorizedView from '../NotAuthorizedView';

describe('NotAuthorizedView', () => {
    
    const message: string = "I'm Not Authroized";
    
    it('should not render child when user is authenticated and has required roles', () => {

        const storeFake = (state: any) => ({
            default: () => {},
            subscribe: () => {},
            dispatch: () => {},
            getState: () => ({ ...state, login: { isAuthenticated: true } })
        });
        const store = storeFake({}) as any;

        render(
            <Provider store={store}>
                <NotAuthorizedView>
                    <div>{message}</div>
                </NotAuthorizedView> 
            </Provider>
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });

    it('should render child when user is authenticated but does not have required roles', () => {
        
        const storeFake = (state: any) => ({
            default: () => {},
            subscribe: () => {},
            dispatch: () => {},
            getState: () => ({ ...state, login: { isAuthenticated: true } })
        });
        const store = storeFake({}) as any;

        render(
            <Provider store={store}>
                <NotAuthorizedView roles={["Admin"]}>
                    <div>{message}</div>
                </NotAuthorizedView> 
            </Provider>
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    });

    it('should render child when user is not authenticated', () => {
        
        const storeFake = (state: any) => ({
            default: () => {},
            subscribe: () => {},
            dispatch: () => {},
            getState: () => ({ ...state, login: { isAuthenticated: false } })
        });
        const store = storeFake({}) as any;

        render(
            <Provider store={store}>
                <NotAuthorizedView>
                    <div>{message}</div>
                </NotAuthorizedView> 
            </Provider>
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    });

    it('should render child when user is not authenticated and user does not have required roles', () => {
        
        const storeFake = (state: any) => ({
            default: () => {},
            subscribe: () => {},
            dispatch: () => {},
            getState: () => ({ ...state, login: { isAuthenticated: false } })
        });
        const store = storeFake({}) as any;

        render(
            <Provider store={store}>
                <NotAuthorizedView roles={["Admin"]}>
                    <div>{message}</div>
                </NotAuthorizedView> 
            </Provider>
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    });
});