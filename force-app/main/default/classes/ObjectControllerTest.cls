@isTest
public class ObjectControllerTest
{
    @isTest
    static void testFetchAllObjectInOrg()
    {
        //Call the method
        Test.startTest();
        Map<String, String> result = ObjectController.FetchAllObjectInOrg();        
        Test.stopTest();
        
        // Verify the result
        System.assertEquals('Account', result.get('Account'), 'The Account object label should be "Account".');
        System.assertEquals('Contact', result.get('Contact'), 'The Contact object label should be "Contact".');
    }
    
    @isTest
    static void testFetchAllFieldInSelectedObject()
    {
        // Create test data
        Account objAccount = new Account(Name='Demo Account');
        insert objAccount;
        
        // Call the method
        Test.startTest();
        Map<String, String> mapResult = ObjectController.FetchAllFieldInSelectedObject('Account');
        Test.stopTest();
        
        // Verify the result
        System.assertEquals(true, mapResult.containsKey('Name'), 'The Name field should be present.');
        System.assertEquals('Name', mapResult.get('Name'), 'The Name field should have the same name.');
    }
    
    @isTest
    static void testFetchAllRecordsOfSelectedObject()
    {
        // Create test data
        String objectName = 'Contact';
        List<String> lstFieldNames = new List<String>{'FirstName', 'LastName'};
            
            // Create test records
            List<Contact> lstContact = new List<Contact>
        {
            new Contact(FirstName = 'Iron', LastName = 'Man'),
            new Contact(FirstName = 'Captain', LastName = 'Marvel')
        };
                    insert lstContact;
        
        // Call the method
        Test.startTest();
        List<sObject> result = ObjectController.FetchAllRecordsOfSelectedObject(objectName, lstFieldNames);
        Test.stopTest();
        
        // Verify the result
        System.assertEquals(lstContact.size(), result.size());
        for (Integer i = 0; i < lstContact.size(); i++)
        {
            Contact objContact = lstContact[i];
            sObject record = result[i];
            System.assertEquals(objContact.FirstName, record.get('FirstName'));
            System.assertEquals(objContact.LastName, record.get('LastName'));
        }
    }
    
    @isTest
    static void testDeleteSelectedRecord()
    {
        // Create test record
        Contact objContact = new Contact(FirstName = 'Captain', LastName = 'America');
        insert objContact;
        
        // Call the method
        Test.startTest();
        ObjectController.DeleteSelectedRecord(objContact);
        Test.stopTest();
        
        // Verify the record has been deleted or not
        List<Contact> result = [SELECT Id FROM Contact WHERE Id = :objContact.Id];
        System.assertEquals(0, result.size(), 'The record has not been deleted.');
    }  
}