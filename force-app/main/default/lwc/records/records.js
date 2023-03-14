import { LightningElement, track, api } from 'lwc';
import fetchAllRecordsOfSelectedObject from '@salesforce/apex/ObjectController.FetchAllRecordsOfSelectedObject';
import deleteSelectedRecord from '@salesforce/apex/ObjectController.DeleteSelectedRecord';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Records extends NavigationMixin(LightningElement) {
    @track GotTheRecords = false;
    @track recordList = [];
    @track valueForLabel = [];
    @track valueForColumn = [];
    @track column = [];
    recordId;

    @track action = [
        { label: 'View', name: 'view' },
        { label: 'Edit', name: 'edit' },
        { label: 'Delete', name: 'delete' }
    ];

    @api refreshRecordList() {
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
        this.column = this.column.concat([
            {
                type: 'action',
                typeAttributes: {
                    rowActions: this.action
                }
            }
        ]);
        console.log('selected object in record.js ' + selectedObject)
        fetchAllRecordsOfSelectedObject({ objectName: selectedObject, fieldNames: fieldsList }).then((result) => {
            console.log('in records result page ' + selectedObject);
            if (result) {
                console.log('jSON ' + JSON.stringify(result));
                this.recordList = [];
                this.recordList = result;
                if (this.recordList.length === 0) {
                    this.showNotification();
                }
                console.log('size of records ' + this.recordList.size);
            } else {
                console.log('error occured');
            }
        }).catch(error => {
            console.log("Error on record method " + error.message)
        })
    }

    //Show notification when no record is there
    showNotification() {
        const evt = new ShowToastEvent({
            title: 'No Records Found In This Object',
            message: 'Please Insert The Records',
            variant: 'Error',
        });
        console.log('In showNotification');
        this.dispatchEvent(evt);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId = row.Id;
        console.log('In handleRowAction actionName ' + actionName);
        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                console.log('In view action');
                break;

            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'edit'
                    }
                });
                console.log('In edit action');
                break;

            case 'delete':
                this.deleteObjectRecord(row);
                break;
            default:
        }
    }

    deleteObjectRecord(currentRow) {
        this.showLoadingSpinner = true;
        console.log('In delete1');
        deleteSelectedRecord({ objDeleteRecord: currentRow }).then(result => {
            console.log('In delete2');
            this.showLoadingSpinner = false;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: currentRow.Name + ' record deleted.',
                variant: 'success'
            }));
            return refreshApex(this.refreshTable);
        }).catch(error => {
            this.showLoadingSpinner = false;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: JSON.stringify(error),
                variant: 'error'
            }));
        });
    }
}