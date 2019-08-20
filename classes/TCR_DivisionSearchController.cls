public with sharing class TCR_DivisionSearchController {

    public static String conditionWithOrder = '';
    public static Integer index = 1;

    @AuraEnabled
    public static List<Account> getDivisions(String searchedDivision) {
        List<Account> result = new List<Account>();
        if (String.isBlank(searchedDivision)) {
            return null;
        }
        try {
            Account searchedAccount = (Account) JSON.deserialize(searchedDivision, Callout_Log__c.class);
            result = fetchRecords(searchedAccount);
        } catch (Exception e) {
            AuraHandledException ae = new AuraHandledException(e.getMessage());
            ae.setMessage(e.getMessage());
            throw ae;
        }
        return result;
    }

    private static String getValueOrBlankSpace(String field) {

        if (String.isNotBlank(field)) {
            if (conditionWithOrder == '') {
                conditionWithOrder = '' + index;
            } else {
                conditionWithOrder += ' AND ' + index;
            }
            index++;
        } else {
            index++;
        }
        return field;
    }

    public static List<Account> fetchRecords(Account searchedAccount) {
        QueryBuilder newQuery = new QueryBuilder(Account.class)
                .addField(Account.Id)
                .addField(Account.Name)
                .addField(Account.Industry)
                .addField(Account.NumberOfEmployees)
                .addField(Account.BillingStreet)
                .addField(Account.BillingCity)
                .addField(Account.BillingPostalCode)
                .addField(Account.BillingCountry)
                .addField(Account.Phone)
                .addConditions()
                .add(new QueryBuilder.LikeCondition(Account.Name).likeAnyRight(getValueOrBlankSpace(searchedAccount.Name)))
                .add(new QueryBuilder.LikeCondition(Account.BillingStreet).likeAnyRight(getValueOrBlankSpace(searchedAccount.BillingStreet)))
                .add(new QueryBuilder.LikeCondition(Account.BillingCity).likeAnyRight(getValueOrBlankSpace(searchedAccount.BillingCity)))
                .add(new QueryBuilder.LikeCondition(Account.BillingPostalCode).likeAnyRight(getValueOrBlankSpace(searchedAccount.BillingPostalCode)))
                .add(new QueryBuilder.LikeCondition(Account.BillingCountry).likeAnyRight(getValueOrBlankSpace(searchedAccount.BillingCountry)))
                .setConditionOrder(conditionWithOrder)
                .endConditions();
        index = 1;
        conditionWithOrder = '1 ';
        return newQuery.toList();
    }
}