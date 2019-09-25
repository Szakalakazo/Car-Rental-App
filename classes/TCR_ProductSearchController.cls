public with sharing class TCR_ProductSearchController {

    @AuraEnabled
    public static List<PricebookEntry> getProductPrice(String productId) {
        try {
            List<PricebookEntry> productPriceList = [
                    SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice, IsActive, Discount_Price__c
                    FROM PricebookEntry
                    WHERE Product2Id = :productId
                    ORDER BY Discount_Price__c DESC
            ];
            return productPriceList;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}