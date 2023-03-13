import { LightningElement, track, api } from 'lwc';
import getRecords from '@salesforce/apex/RecordsFetcherClass.getRecords';
//import deleteRecord from '@salesforce/apex/RecordsFetcherClass.deleteRecord';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Records extends NavigationMixin(LightningElement) {
    @track GotTheRecords = false;
    @track recordList = [];
    @track valueForLabel = [];
    @track valueForColumn = [];
    @track column = [];
    recordId;
    title = 'No Records Found In This Object';
    message = 'Please Insert The Records';
    variant = 'Error';


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
        getRecords({ objectName: selectedObject, fieldNames: fieldsList }).then((result) => {
            console.log('in records result page ' + selectedObject);
            if (result) {
                console.log('jSON ' + JSON.stringify(result));
                this.recordList = [];
                this.recordList = result;
                if (this.recordList.length === 0) {
                    this.showNotification();
                }
                //this.GotTheRecords = true;
                console.log('size of records ' + this.recordList.size);
            } else {
                console.log('error occured');
            }
        }).catch(error => {
            console.log("Error on record method " + error.message)
        })
    }

    showNotification() {
        const evt = new ShowToastEvent({
            title: this.title,
            message: this.message,
            variant: this.variant,
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
                        objectApiName: 'Opportunity',
                        actionName: 'edit'
                    }
                });
                console.log('In edit action');
                break;

            // case 'delete':
            //     this. deleteRecord(row);
            //     break;
            default:
        }
    }

    // deleteRecord(currentRow) {
    //     this.showLoadingSpinner = true;
    //     deleteRecord({ objaccount: currentRow }).then(result => {
    //         window.console.log('result^^' + result);
    //         this.showLoadingSpinner = false;
    //         this.dispatchEvent(new ShowToastEvent({
    //             title: 'Success!!',
    //             message: currentRow.Name + ' account deleted.',
    //             variant: 'success'
    //         }));
    //         return refreshApex(this.refreshTable);
    //     }).catch(error => {
    //         window.console.log('Error ====> ' + error);
    //         this.showLoadingSpinner = false;
    //         this.dispatchEvent(new ShowToastEvent({
    //             title: 'Error!!',
    //             message: JSON.stringify(error),
    //             variant: 'error'
    //         }));
    //     });
    // }
}