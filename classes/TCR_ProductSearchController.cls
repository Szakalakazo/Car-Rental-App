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

    @AuraEnabled
    public static Double getAverageRating(String productId) {
        Double sum = 0;
        List<Product_Review__c> productReviews = TCR_ProductReviewController.getProductReviews(productId);
        if (!productReviews.isEmpty()) {
            for (Product_Review__c review : productReviews) {
                sum += review.Rating__c;
            }
            return sum / productReviews.size();
        } else {
            return 0;
        }
    }
}