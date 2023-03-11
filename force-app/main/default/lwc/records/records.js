import { LightningElement, track, api } from 'lwc';
import getRecords from '@salesforce/apex/RecordsFetcherClass.getRecords';
export default class Records extends LightningElement {
    @track GotTheRecords = false;
    @track recordList = [];
    @track valueForLabel = [];
    @track valueForColumn = [];
    @track column = [];

    @api refreshRecordList(){
        this.recordList = [];
        this.valueForLabel = [];
        this.valueForColumn = [];
        this.column = [];
    }

    @api getTheRecords(selectedObject, fieldsList) {
        this.valueForLabel = fieldsList;
        this.valueForColumn = fieldsList.map((value, index) => ({
            label: this.valueForLabel[index],
            fieldName: value
        }))
        this.column = this.valueForColumn;
        console.log('selected object in record.js ' + selectedObject)
        getRecords({ objectName: selectedObject, fieldNames: fieldsList }).then((result) => {
            console.log('in records result page ' + selectedObject);
            if (result) {
                console.log('jSON ' + JSON.stringify(result));
                this.recordList = [];
                this.recordList = result;
                //this.GotTheRecords = true;
                console.log('size of records' + this.recordList.size);
            } else {
                console.log('error occured');
            }
        }).catch(error => {
            console.log("Error on record method " + error.message)
        })
    }
}