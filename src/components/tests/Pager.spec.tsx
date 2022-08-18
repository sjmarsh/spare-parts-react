import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Pager from '../Pager';

test('should render pager with 2 pages', () => {

    const {container} = render(
        <Pager totalItemCount={8} pageSize={5} currentPage={1}/> 
    )

    const pageItems = container.getElementsByClassName('page-item');
    expect(pageItems.length).toBe(4);  // 2 pages + navigate first and navigate last links
});

test('should render pager with 1 page', () => {

    const {container} = render(
        <Pager totalItemCount={3} pageSize={5} currentPage={1}/> 
    )

    const pageItems = container.getElementsByClassName('page-item');
    expect(pageItems.length).toBe(3);  // 2 pages + navigate first and navigate last links
});

test('should set current page from props to active', async () => {
        
    const {container} = render(
        <Pager totalItemCount={13} pageSize={5} currentPage={3}/> 
    )
     
    const pageItems = container.getElementsByClassName('page-item');
    expect(pageItems[3].classList).toContain('active');    
});

test('should fire page click event', async () => {
    
    let page = 0;
    const handlePageClick = (pageNumber: number) => {
        page = pageNumber;
    }
    
    const {container} = render(
        <Pager totalItemCount={8} pageSize={5} currentPage={1} onPageClick={handlePageClick}/> 
    )

    const pageLinks = container.getElementsByClassName('page-link');
    expect(pageLinks.length).toBe(4);
    const secondPage = pageLinks[2]; // 0 = << , 1 = 1, 2 = 2
    
    fireEvent.click(secondPage);
    
    expect(page).toBe(2);
});

test('should set page to active when clicked', async () => {
    
    let page = 0;
    const handlePageClick = (pageNumber: number) => {
        page = pageNumber;
    }
    
    const {container} = render(
        <Pager totalItemCount={8} pageSize={5} currentPage={1} onPageClick={handlePageClick}/> 
    )

    const pageLinks = container.getElementsByClassName('page-link');
    const secondLink = pageLinks[2]; // 0 = << , 1 = 1, 2 = 2 
    
    fireEvent.click(secondLink);  // click second page
    
    const pageItems = container.getElementsByClassName('page-item');
    expect(pageItems[2].classList).toContain('active');
});
