import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import DetailMode from '../../app/constants/detailMode';
import FetchStatus from '../../app/constants/fetchStatus';
import RequestStatus from '../../app/constants/requestStatus';
import TableSettings from '../../app/constants/tableSettings';
import Pager from '../../components/Pager';
import useMessageBox from '../../components/messageBox/MessageBox';
import MessageBoxType from '../../components/messageBox/types/messageBoxType';
import MessageBoxResult from '../../components/messageBox/types/messageBoxResult';

import { selectPageOfParts, fetchParts, deletePart, setCurrentPage } from './partListSlice';
import { showDetail, fetchPart } from './partDetailSlice';

const PartTable = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const pageOfParts = useAppSelector(selectPageOfParts);
    const totalItemCount = useAppSelector(state => state.partsList.totalItemCount);
    const currentPage = useAppSelector(state => state.partsList.currentPage);
    const partsStatus = useAppSelector(state => state.partsList.status);
    const hasError = useAppSelector(state => state.partsList.hasError);
    const errorMessage = useAppSelector(state => state.partsList.error);
    const [ showMessage, MessageBox ] = useMessageBox();
       
    useEffect(() => {
        if(partsStatus === FetchStatus.Idle) {
            dispatch(fetchParts(currentPage));
        }
    }, [partsStatus, dispatch, currentPage])

    const handleOnAddPart = () => {
        dispatch(fetchPart(0)).then(
            () => dispatch(showDetail({mode: DetailMode.Add, id: 0}))
        );
    }
    
    const handleOnEditPart = (partId: number) => {
        dispatch(fetchPart(partId)).then(
            () => dispatch(showDetail({mode: DetailMode.Edit, id: partId}))
        );
    }

    const handleOnDeletePart = async (partId: number) => {
        const messageResult = await showMessage('Are you sure you want to delete this part?', 'Confirm Delete', MessageBoxType.YesNo);
        if(messageResult === MessageBoxResult.Yes)
        {
            dispatch(deletePart(partId)).then((res) => {
                if(res.meta.requestStatus === RequestStatus.Fulfilled) {
                    dispatch(fetchParts(currentPage));
                };
            });                
        }
    }

    const handleFetchReport = () => {
        navigate('/part-report');
    }

    const handleOnPageClick = (pageNumber: number) => {
        dispatch(fetchParts(pageNumber)).then((re) => {
            dispatch(setCurrentPage(pageNumber));
        });
    }

    return (
        <div>
    
        { partsStatus === FetchStatus.Loading && 
            <Spinner animation="border" role="status" >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        }
        {
           hasError && errorMessage &&
           <Alert variant='danger'>{errorMessage}</Alert>
        }
        { partsStatus === FetchStatus.Failed && 
            <Alert variant='danger'>An error occurred fetching parts.</Alert>
        }
       
        <div className='tool-container'>
            <button className="btn btn-outline-dark tool-button" onClick={handleFetchReport}><span className="oi oi-print tool-button-image" title="Report" aria-hidden="true"/><span>Report</span></button>
            <button className="btn btn-outline-dark tool-button" onClick={handleOnAddPart}><span className="oi oi-plus tool-button-image" title="Add Part" aria-hidden="true"/><span>Add Part</span></button>
        </div>

        <Table hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Weight</th>
                    <th>Price</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {pageOfParts.map((part, index) => (
                <tr key={index}>
                    <td>{part.name}</td>
                    <td>{part.description}</td>
                    <td>{part.category}</td>
                    <td>{Number(part.weight).toFixed(2)}</td>
                    <td>{new Intl.NumberFormat('en-AU', {style: 'currency', currency: 'AUD'}).format(part.price)}</td>
                    <td>{new Date(part.startDate).toLocaleDateString('en-au')}</td>
                    <td>{part.endDate === null ? '' : new Date(part.endDate || '').toLocaleDateString('en-au')}</td>
                    <td><Button variant="link" onClick={() => handleOnEditPart(part.id)}>Edit</Button></td>
                    <td><Button variant="link" onClick={() => handleOnDeletePart(part.id)}>Delete</Button></td>
                </tr>
            ))}  
            </tbody>
        </Table>
        
        <Pager totalItemCount={totalItemCount} pageSize={TableSettings.PageSize} currentPage={currentPage} onPageClick={handleOnPageClick} />
        
        <MessageBox/>
    </div>
    )
}

export default PartTable;
