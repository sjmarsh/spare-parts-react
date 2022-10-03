import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import AuthorizedView from '../AuthorizedView';

describe('AuthorizedView', () => {
    
    const message: string = "I'm Authroized";

    it('should render child when user is authenticated and has required roles', () => {
        const storeFake = (state: any) => ({
            default: () => {},
            subscribe: () => {},
            dispatch: () => {},
            getState: () => ({ ...state, login: { isAuthenticated: true } })
        });
        const store = storeFake({}) as any;

        render(
            <Provider store={store}>
                <AuthorizedView>
                    <div>{message}</div>
                </AuthorizedView> 
            </Provider>
        );

        const result = screen.queryByText(message);
        expect(result).not.toBeNull();
    }); 

    it('should not render child when user is authenticated but does not have required roles', () => {
        
        const storeFake = (state: any) => ({
            default: () => {},
            subscribe: () => {},
            dispatch: () => {},
            getState: () => ({ ...state, login: { isAuthenticated: true } })
        });
        const store = storeFake({}) as any;

        render(
            <Provider store={store}>
                <AuthorizedView roles={["Admin"]}>
                    <div>{message}</div>
                </AuthorizedView> 
            </Provider>
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });

    it('should not render child when user is not authenticated', () => {
        
        const storeFake = (state: any) => ({
            default: () => {},
            subscribe: () => {},
            dispatch: () => {},
            getState: () => ({ ...state, login: { isAuthenticated: false } })
        });
        const store = storeFake({}) as any;

        render(
            <Provider store={store}>
                <AuthorizedView>
                    <div>{message}</div>
                </AuthorizedView> 
            </Provider>
        );

        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });

    it('should not render child when user is not authenticated and user does not have required roles', () => {
        
        const storeFake = (state: any) => ({
            default: () => {},
            subscribe: () => {},
            dispatch: () => {},
            getState: () => ({ ...state, login: { isAuthenticated: false } })
        });
        const store = storeFake({}) as any;

        render(
            <Provider store={store}>
                <AuthorizedView roles={["Admin"]}>
                    <div>{message}</div>
                </AuthorizedView> 
            </Provider>
        );
        
        const result = screen.queryByText(message);
        expect(result).toBeNull();
    });
   
});