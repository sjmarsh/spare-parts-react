import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useNavigate, useParams } from "react-router-dom";

import { fetchReport, clearReport } from './inventoryReportSlice';
import FetchStatus from '../../app/constants/fetchStatus';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

const InventoryReport = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const reportFetchStatus = useAppSelector(state => state.inventoryReport.fetchStatus);
    const reportData = useAppSelector(state => state.inventoryReport.reportData);
    const errorMessage = useAppSelector(state => state.inventoryReport.message);

    const { historyMode } = useParams();
    const isCurrent = historyMode === 'current';

    useEffect(() => {
        if(reportFetchStatus === FetchStatus.Idle) {
            dispatch(fetchReport(isCurrent));
        }
    }, [reportFetchStatus, dispatch]);
    
    const handleNavBack = () => {
        dispatch(clearReport());
        navigate('/inventory');
    }

    return(
        <div className="pdf-container">
            { reportFetchStatus === FetchStatus.Loading && 
            <Spinner animation="border" role="status" >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            }
            {
            errorMessage &&
            <Alert variant='danger'>{errorMessage}</Alert>
            }
            { reportFetchStatus === FetchStatus.Failed && 
                <Alert variant='danger'>An error occurred fetching report.</Alert>
            }

            <div className='tool-container'>
                <button className="btn btn-outline-dark tool-button" onClick={handleNavBack}><span className="oi oi-arrow-circle-left" title="Back" aria-hidden="true"/></button>
            </div>
            <iframe src={reportData} className="pdf-view"/>

        </div>
    );
}

export default InventoryReport;