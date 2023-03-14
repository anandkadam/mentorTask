public with sharing class ObjectController
{
    //This method fetch all the object in the org
    @AuraEnabled
    public static Map<String,String> FetchAllObjectInOrg()
    {
        try
        { 
          Map<String,String> mapString = new Map<String,String>();
            for(Schema.SObjectType objSObjectType : Schema.getGlobalDescribe().values())
            {
                Schema.DescribeSObjectResult DescribeSObjectResult = objSObjectType.getDescribe(); 
                 String name = objSObjectType.getDescribe().getLocalName();
                 String label = objSObjectType.getDescribe().getLabel();
                mapString.put(name,label);
            }
          return mapString;
        }
        catch (Exception ex)
        {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    //This method fetch all fields of selected object
    @AuraEnabled
    public static Map<String,String> FetchAllFieldInSelectedObject(String ObjectName)
    {
        try
        {
            Map<String, String> mapNewFields = new Map<String,string>();
            Map<String, Schema.SObjectType> fieldMap = Schema.getGlobalDescribe();
            for(Schema.SObjectField fields : fieldMap.get(ObjectName).getDescribe().fields.getMap().values())
            {
                mapNewFields.put(fields.getDescribe().getName(), fields.getDescribe().getName());
            }  
            return mapNewFields;
        } catch (Exception ex)
        {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    //This method fetch all records of perticular selected object and selected field
    @AuraEnabled
    public static List<sObject> FetchAllRecordsOfSelectedObject(String objectName, List<String> fieldNames)
    {
        List<sObject> lstRecord = new List<sObject>();
        if (fieldNames != null && !fieldNames.isEmpty())
        {
            String soql = 'SELECT ';
            for (String fieldName : fieldNames)
            {
                soql += fieldName + ',';
            }
            soql = soql.removeEnd(',');
            soql += ' FROM ' + objectName;
            lstRecord = Database.query(soql);
        }
        return lstRecord;
    }

    @AuraEnabled
    public static void DeleteSelectedRecord(sObject objDeleteRecord)
    {
        try
        {
            delete objDeleteRecord;
        }
        catch(Exception ex)
        {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}