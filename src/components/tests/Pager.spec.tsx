import { render, fireEvent, screen } from '@testing-library/react';
import { test, expect } from 'vitest';

import Pager from '../Pager';

test('should render pager with 2 pages', () => {

    render(
        <Pager totalItemCount={8} pageSize={5} currentPage={1}/> 
    )
    
    const pager = screen.getByRole('navigation');
    expect(pager).toBeInTheDocument();
           
    expect(pager.childElementCount).toBe(4);  // 2 pages + navigate first and navigate last links
    expect(pager.childNodes[0].textContent).toBe('«First');
    expect(pager.childNodes[1].textContent).toBe('1(current)');
    expect(pager.childNodes[2].textContent).toBe('2');
    expect(pager.childNodes[3].textContent).toBe('»Last');   
});

test('should render pager with 1 page', () => {

    render(
        <Pager totalItemCount={3} pageSize={5} currentPage={1}/> 
    )

    const pager = screen.getByRole('navigation');
    expect(pager).toBeInTheDocument();
           
    expect(pager.childElementCount).toBe(3); 
});

test('should set current page from props to active', async () => {
        
    render(
        <Pager totalItemCount={13} pageSize={5} currentPage={3}/> 
    )

    const pager = screen.getByRole('navigation');
    expect(pager).toBeInTheDocument();
    expect(pager.childNodes[3].textContent).toBe('3(current)');
});

test('should fire page click event', async () => {
    
    let page = 0;
    const handlePageClick = (pageNumber: number) => {
        page = pageNumber;
    }
    
    render(
        <Pager totalItemCount={8} pageSize={5} currentPage={1} onPageClick={handlePageClick}/> 
    )
    
    const page2 = screen.getAllByText('2')[0];
    expect(page2).toHaveClass('page-link');
    
    fireEvent.click(page2);
    
    expect(page).toBe(2);
});

test('should set page to active when clicked', async () => {
        
    const handlePageClick = (pageNumber: number) => {
        // do nothing
    }
    
    render(
        <Pager totalItemCount={8} pageSize={5} currentPage={1} onPageClick={handlePageClick}/> 
    )

    const pager = screen.getByRole('navigation');
    const page2 = screen.getAllByText('2')[0];
    expect(page2).toHaveClass('page-link');
    expect(pager.childNodes[2].textContent).toBe('2');

    fireEvent.click(page2);
        
    expect(pager.childNodes[2].textContent).toBe('2(current)');
});
