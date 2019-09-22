public with sharing class TCR_ProductSearchController {

    @AuraEnabled
    public static List<PricebookEntry> getProductPrice(String productId) {
        try {
            List<PricebookEntry> productPriceList = [
                    SELECT Id, Pricebook2Id, Product2Id, UnitPrice, IsActive
                    FROM PricebookEntry
                    WHERE IsActive = true
                    AND Product2Id = :productId
                    ORDER BY UnitPrice DESC
            ];
            return productPriceList;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}