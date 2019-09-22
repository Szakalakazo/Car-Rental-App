public with sharing class TCR_OrderHistory {

/*    @AuraEnabled
    public static List<Order> selectAllCreatedOrder() {
        Account account = selectAccount('0031t0000091WvLAAU');
        return [
                SELECT Id, Status, OrderNumber, EffectiveDate, TotalAmount, Pricebook2Id
                FROM Order
                WHERE AccountId = :account.Id
                AND Status != 'Draft'
                ORDER BY EffectiveDate DESC];
    }*/

/*    public static Account selectAccount(String contactId) {
        Contact contact = selectContact(contactId);
        String accountId = contact.AccountId;
        List<Account> accounts = [
                SELECT Id, Name
                FROM Account
                WHERE Id = :accountId
        ];
        return accounts.get(0);
    }*/

    public static List<Contact> selectContact(String contactId) {
        List<Contact> contacts = [
                SELECT Name, Email, AccountId
                FROM Contact
                WHERE Id = :contactId

        ];
//        return contacts.get(0);
        return contacts;
    }



}