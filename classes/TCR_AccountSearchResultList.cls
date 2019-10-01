public with sharing class TCR_AccountSearchResultList {

    @AuraEnabled
    public static List<Account> getAccounts(String account){
        return [SELECT Id, name, industry, Type, NumberOfEmployees, TickerSymbol, Phone FROM Account ORDER BY createdDate ASC];
    }
}