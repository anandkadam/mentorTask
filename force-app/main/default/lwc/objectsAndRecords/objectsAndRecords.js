import { LightningElement, api, track } from 'lwc';
import ObjectNames from '@salesforce/apex/ObjectController.FetchAllObjectInOrg';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ObjectsAndRecords extends NavigationMixin(LightningElement) {
  @track SelectedFieldList = [];
  @track objectList = [];
  @track fieldsList = [];
  @api selectedObject;
  @track gotTheobjectNames = false;
  @track objectName;

  constructor() {
    super();
    ObjectNames({ objectName: this.selectedObject }).then((result) => {
      if (result) {
        this.objectList = [];
        for (let key in result) {
          this.objectList.push({ label: key, value: key });
        }
        this.gotTheobjectNames = true;
      } else {
        console.log('Error occured');
      }
    });
  }

  handleFields(event) {
    this.salectedObject = event.detail.value;
    this.objectName = event.detail.value;
    this.template.querySelector('c-field-names').getAllFields(event.detail.value);
    console.log('Selected------->' + this.salectedObject);
    this.template.querySelector('c-field-Names').refreshFieldList();
    this.template.querySelector('c-records').refreshRecordList();
    console.log('in refreshTableData');
  }

  handlecheckbox(event) {
    console.log('event.detail ' + event.detail);
    this.SelectedFieldList = event.detail;
    console.log('this.selectedObject' + this.selectedObject)
    console.log('back to parent' + this.objectName);
    this.template.querySelector('c-records').getTheRecords(this.objectName, this.SelectedFieldList);
  }

  showNotificationOnObjectSelection() {
    const evt = new ShowToastEvent({
        title: 'Select Object',
        message: 'Please Select Object To Create a Record',
        variant: 'Error',
    });
    console.log('In showNotification');
    this.dispatchEvent(evt);
}

  createRecord() {
    console.log("In On Click Button");
    if(this.objectName.length === 0){
      this.showNotificationOnObjectSelection();
    }
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: this.objectName,
        actionName: "new"
      }
    });
  }
}