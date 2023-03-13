import { LightningElement } from 'lwc';
import { wire,api,track} from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ObjectNames from '@salesforce/apex/ObjectApexController.FetchObjectName';
import getFields from '@salesforce/apex/ObjectApexController.getFields';

export default class ObjectsAndRecords extends LightningElement {
  @track SelectedFieldList=[];  
  @track objectList=[];
  @track fieldsList=[];
  @api selectedObject;
  @track gotTheobjectNames=false;
  
 
constructor(){
  super();
     ObjectNames({objectName: this.selectedObject}).then((result)=> {
      if(result) {
        this.objectList=[];
        
        for(let key in result){
         
          this.objectList.push({label:key , value:key});
        }
        this.gotTheobjectNames=true;
        
       
      }else{
        console.log('Error occured');
      }});

}

  HandleFields(event){
   
   this.salectedObject=event.detail.value;
   this.template.querySelector('c-field-names').getAllFields(event.detail.value);
    console.log('Selected------->'+this.salectedObject); 
   
        console.log('error occured');
    
  }
  Handlecheckbox(event){
    console.log('in the parent javascript');
    console.log('event.detail.value'+event.detail.value);
    this.SelectedFieldList = event.target.value;
    console.log('this.selectedObject'+this.selectedObject)
    console.log('back to parent'+this.SelectedFieldList);
    this.template.querySelector('c-records').getTheRecords(this.selectedObject,this.SelectedFieldList);
  }
 

}