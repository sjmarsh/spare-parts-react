import React from "react";
import humanizeString from "humanize-string";

import DataRowDetail from "./types/dataRowDetail";
import { getUUid } from "../../app/helpers/uuidHelper";

interface InputProps {
    detailRows?: Array<DataRowDetail> | null;
}

const SimpleDataGridDetailSection = (props: InputProps) => {
    return (
        props.detailRows && props.detailRows.map((detailRow, index) => (
            detailRow.data && detailRow.data.length > 0 && 
            <div key={getUUid()}>
                <h6>{humanizeString(detailRow.detailHeader)}</h6>
                <table className="table table-secondary">
                    <thead>
                        <tr key={`dr-${index}`}>
                            {
                                Array.from(detailRow.data[0].keys()).map((dataItemHeader, headerIndex) => (
                                    <th key={`dih-${headerIndex}`}>{humanizeString(dataItemHeader)}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            detailRow.data.map((dataItemRow, dataIndex) => (
                                <tr key={`dd-${index}-${dataIndex}`}>
                                    {
                                        Array.from(dataItemRow.values()).map((dataItemValue, dataItemIndex) => (
                                            <td key={`div-${index}-${dataIndex}-${dataItemIndex}`}>{dataItemValue}</td>                                            
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>    
        ))
    )
}

export default SimpleDataGridDetailSection