import React, { useState } from 'react';

import Pagination from 'react-bootstrap/Pagination';

interface InputProps {
    currentPage: number;
    pageSize: number;
    totalItemCount: number;
    onPageClick?: (pageNumber: number) => void | null; 
}

const Pager = (props: InputProps) => {

    const [currentPage, setCurrentPage] = useState(props.currentPage ?? 1);

    const getPageCount = () => {
        return Math.ceil(props.totalItemCount / props.pageSize);   
    }

    const handleOnClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        if(props.onPageClick){
            props.onPageClick(pageNumber);
        }
    }

    let items = [];
    let pageCount = getPageCount();
    for(let i = 1; i <= pageCount; i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => handleOnClick(i)}>{i}</Pagination.Item>
        )
    }

    return (
        <Pagination>
            <Pagination.First onClick={() => handleOnClick(1)} />
            {items}       
            <Pagination.Last onClick={() => handleOnClick(pageCount)}/>
        </Pagination>
    );

}

export default Pager;