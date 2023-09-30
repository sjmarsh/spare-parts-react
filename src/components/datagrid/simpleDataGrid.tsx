import React, {useState, useEffect} from "react";
import humanizeString from "humanize-string";

import ButtonIcon from "../buttons/buttonIcon";
import ColumnHeader from "./types/columnHeader";
import DataRow from "./types/dataRow";
import IconButton from "../buttons/IconButton";
import SimpleDataGridDetailSection from "./simpleDataGridDetailSection";
import { updateArrayItem } from "../../app/helpers/arrayHelper";

interface InputProps<T> {
    dataSource: Array<T>;
    columnList: Array<ColumnHeader>;
}

const SimpleDataGrid = <T,>(props: InputProps<T>) => {

    const [dataRows, setDataRows] = useState(new Array<DataRow<T>>);
    
    useEffect(() => {
        setDataRows(props.dataSource.map(d => new DataRow(d, props.columnList)));
    },[props, props.dataSource, props.columnList]);

    
    const handleShowDetail = (row: DataRow<T>) => {
        row.isDetailsisible = !row.isDetailsisible;
        const state = updateArrayItem<DataRow<T>>(dataRows, row);
        setDataRows(state);
    }

    return(
        dataRows !== null && dataRows.length > 0 && <div>
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
                    dataRows.map((row, index) => [
                    <tr key={index}>
                        <td>
                            {row.isDetailsisible && <IconButton buttonTitle="Hide Details" isTitleVisible={false} icon={ButtonIcon.ChevronTop} onClick={() => handleShowDetail(row)}/>}
                            {!row.isDetailsisible && <IconButton buttonTitle="Show Details" isTitleVisible={false} icon={ButtonIcon.ChevronBottom} onClick={() => handleShowDetail(row)}/>}
                        </td>
                        {
                            row.data && Array.from(row.data.values()).map((v, i) => (
                                <td key={i}>{v}</td>
                            ))   
                        }
                    </tr>, 
                    row.isDetailsisible &&  row.detailRows && 
                    <tr key={`${index}-details`}>                            
                        <td colSpan={dataRows[0].data.size} key={`${index}-details-td`}>
                            <SimpleDataGridDetailSection detailRows={row.detailRows}/>
                        </td>                                            
                    </tr>
                    ]) 
                    }
                </tbody>
            </table>

        </div>
    )
}

export default SimpleDataGrid