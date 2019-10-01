public with sharing class TCR_GetCasesByContract {


    @AuraEnabled
    public static List<Case> getCasesByContract(String selectedCaseId) {
        List<Case> results = new List<Case>();

        if (String.isEmpty(selectedCaseId)) {
            return null;
        }
        try {
            Case caseContactId = [SELECT ContactId FROM Case WHERE Id = :selectedCaseId];
            Contact tempContact = [SELECT Id,Name FROM Contact WHERE Id = :caseContactId.ContactId];
            results = [SELECT Id, ContactId FROM Case WHERE ContactId = :tempContact.Id];
        } catch (Exception e) {
            AuraHandledException ae = new AuraHandledException(e.getMessage());
            ae.setMessage(e.getMessage());
            throw ae;
        }
        return results;
    }
}