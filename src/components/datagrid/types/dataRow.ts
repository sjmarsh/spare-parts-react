import ColumnHeader from "./columnHeader";
import { getFormattedValue } from "../../../app/helpers/stringHelper";

class DataRow<T> {
    private sourceItem: T;
    private columnList: Array<ColumnHeader>;
    public data: Map<string,string>;

    constructor(sourceItem: T, columnList: Array<ColumnHeader>){
        this.sourceItem = sourceItem;
        this.columnList = columnList;
        this.data = this.getData<T>();
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
}

export default DataRow;