public with sharing class ObjectComponentApex {
    //Retrieve all objects in the organization
    @AuraEnabled(cacheable = true)
    public static map<String, String> allObjectsInOrg(){
        try{
        Map<String, String> mapAllObjects = new Map<String, String>();
        for(Schema.SObjectType objSObject : Schema.getGlobalDescribe().values()){
            Schema.DescribeSObjectResult objObjects = objSObject.getDescribe();
            String name = objSObject.getDescribe().getLocalName();
            String label = objSObject.getDescribe().getLabel();
            mapAllObjects.put(name, label);
        }
        return mapAllObjects;
    }catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
    }
}