import React from "react";

import ColumnHeader from "./types/columnHeader";
import DataRow from "./types/dataRow";

import humanizeString from "humanize-string";

interface InputProps<T> {
    dataSource: Array<T>;
    columnList: Array<ColumnHeader>;
}

const SimpleDataGrid = <T,>(props: InputProps<T>) => {

    const dataRows = props.dataSource.map(d => new DataRow(d, props.columnList));
    
    return(
        props.dataSource !== null && <div>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        {
                            Array.from(dataRows[0].data.keys()).map((k, i) => (
                                <th key={i}>{humanizeString(k)}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    { 
                    dataRows.map((row, index) => (
                    <tr key={index}>
                        <td></td>
                        {
                            row.data && Array.from(row.data.values()).map((v, i) => (
                                <td key={i}>{v}</td>
                            ))
                        }
                    </tr>
                    ))
                    }
                </tbody>
            </table>

        </div>
    )
}

export default SimpleDataGrid