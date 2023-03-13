public with sharing class FieldComponentApex {
    @AuraEnabled(cacheable=true)
    public static Map<String, String> getAllFieldsOfObject(String objectName){
        try {
            Map<String, String> mapFieldOfObject = new Map<String, String>();
            Map<String, Schema.SObjectType> mapField = Schema.getGlobalDescribe();
            for(Schema.SObjectField objField : mapField.get(objectName).getDescribe().fields.getMap().values()){
                mapFieldOfObject.put(objField.getDescribe().getName(), objField.getDescribe().getName());
            }
            //System.debug('debug'+mapFieldOfObject);
            return mapFieldOfObject;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());            
        }
    }
}