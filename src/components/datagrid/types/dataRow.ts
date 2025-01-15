import ColumnHeader from "./columnHeader";
import DataRowDetail from "./dataRowDetail";
import WithId from "../../../app/types/withId";
import { getFormattedValue } from "../../../app/helpers/stringHelper";
import { getUUid } from '../../../app/helpers/uuidHelper';

class DataRow<T> implements WithId {
    private sourceItem: T;
    private columnList: Array<ColumnHeader>;

    public id: string;
    public data: Map<string,string>;
    public isDetailsVisible: boolean;
    public detailRows?: Array<DataRowDetail> | null;

    constructor(sourceItem: T, columnList: Array<ColumnHeader>){

        this.sourceItem = sourceItem;
        this.columnList = columnList;
        
        this.id = getUUid();
        this.data = this.getData<T>();
        this.isDetailsVisible = false;
        this.detailRows = this.getDetailRows();
    }
   
    private getData = <T>() : Map<string,string> => {
        const myData = new Map<string, string>();

        if(this.sourceItem && this.columnList){
            const keys = Object.keys(this.sourceItem);
            const entries = Object.entries(this.sourceItem);
            
            keys.forEach(key => {
                const columnName = key;
                if(this.columnList.find(c => c.columnName == columnName && c.parentColumnName === undefined)) {
                    let value = "";
                    let entry = entries.find(e => e[0] == columnName);
                    if(entry) {
                        value = getFormattedValue(entry[1]);
                    }
                    myData?.set(columnName,value);
                }
            })
        }

        return myData;
    }

    private getDetailRows = () : Array<DataRowDetail> | null => {
        let detailRows = new Array<DataRowDetail>;
        if(this.sourceItem && this.columnList) {
            const props = Object.entries(this.sourceItem);
            props.forEach(prop => {
                const columnName = prop[0];
                const columnValue = prop[1];
                if(this.columnList.find(c => c.columnName === columnName && c.parentColumnName === undefined) === undefined) {
                    detailRows.push(this.getRowDetails(this.sourceItem, columnName, columnValue));                   
                }
            });
        }
        return detailRows;
    }

    private getRowDetails = (sourceItem : T, columnName: string, columnValue: any) : DataRowDetail => {
        let detailData = new Array<Map<string, string>>();
        if(sourceItem){
            if(columnValue && Array.isArray(columnValue)) {
                const arrayValue = columnValue as Array<any>;
                if(arrayValue){
                    arrayValue.forEach(item => {
                        const itemRow = new Map<string, string>();
                        const itemEntries = Object.entries(item);
                        itemEntries.forEach((e) => {
                            const entryName = e[0];
                            if(this.columnList.find(c => c.columnName.toLowerCase() === entryName.toLowerCase() && c.parentColumnName !== undefined)){
                                const entryValue = getFormattedValue(e[1]);
                                itemRow.set(entryName, entryValue);                                
                            }                            
                        });
                        detailData.push(itemRow);
                    });
                }
            }
            // TODO handle detail objects other than arrays
        }
             
        return { detailHeader: columnName, data: detailData } as DataRowDetail;
    }
}

export default DataRow;