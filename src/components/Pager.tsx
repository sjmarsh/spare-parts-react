import React, { useState, useEffect } from 'react';

import Pagination from 'react-bootstrap/Pagination';

interface InputProps {
    currentPage: number;
    pageSize: number;
    totalItemCount: number;
    onPageClick?: (pageNumber: number) => void | null; 
}

const Pager = (props: InputProps) => {

    const [currentPage, setCurrentPage] = useState(props.currentPage ?? 1);

    useEffect(() => {
        setCurrentPage(props.currentPage);
    }, [props.currentPage]);

    const getPageCount = () => {
        return Math.ceil(props.totalItemCount / props.pageSize);   
    }

    const handleOnClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        if(props.onPageClick){
            props.onPageClick(pageNumber);
        }
    }

    const isActive = (pageNumber: number) => {
        return pageNumber === currentPage;                
    }

    const getAriaLabel = (pageNumber: number) => {
        if(isActive(pageNumber)){
            return `Current Page, Page ${pageNumber}`;
        }
        return `Goto Page ${pageNumber}`;
    }

    let items = [];
    let pageCount = getPageCount();
    for(let i = 1; i <= pageCount; i++) {
        items.push(
            <Pagination.Item key={i} active={isActive(i)} role="link" aria-current={isActive(i)} aria-label={getAriaLabel(i)} onClick={() => handleOnClick(i)}>{i}</Pagination.Item>
        )
    }

    return (
        <Pagination role='navigation' aria-label='Pagination Navigation'>
            <Pagination.First aria-label="Goto First Page" role="link" onClick={() => handleOnClick(1)} />
            {items}       
            <Pagination.Last aria-label="Goto Last Page" role="link" onClick={() => handleOnClick(pageCount)}/>
        </Pagination>
    );

}

export default Pager;