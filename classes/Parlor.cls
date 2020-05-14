public class Parlor {

    @InvocableMethod
    public static void LeadAssign(List<Id> LeadIds) {
        LeadStatus CLeadStatus = [SELECT Id, ApiName FROM LeadStatus WHERE IsConverted = true Limit 1];
        List<Database.LeadConvert> massLeadConvert = new List<Database.LeadConvert>();

        List<Lead> leads = [SELECT Id, IsConverted FROM Lead WHERE Id = :LeadIds];
        for (Lead convertedLead : leads) {
            if (!convertedLead.IsConverted) {
                Database.LeadConvert leadConvert = new Database.LeadConvert();
                leadConvert.setLeadId(convertedLead.Id);
                leadConvert.setConvertedStatus(CLeadStatus.ApiName);
                leadConvert.setDoNotCreateOpportunity(TRUE); //Remove this line if you want to create an opportunity from Lead Conversion
                massLeadConvert.add(leadConvert);
            }
        }
        if (!MassLeadconvert.isEmpty()) {
            Database.convertLead(MassLeadconvert);
        }
    }

    private static void veryBadCode(List<String> listOfString) {
        for (String str : listOfString) {
            Account acc = new Account(Name = str);
            insert acc;
        }
    }

    private static void anotherVeryBadCode(List<String> listOfString) {
        for (String str : listOfString) {
            Account acc = new Account(Name = str);
            insert acc;
        }
    }
}