public with sharing class TCR_ProductReviewController {

    @AuraEnabled
    public static List<Product_Review__c> getProductReviews(String productId) {
        List<Product_Review__c> productReviews = new List<Product_Review__c>();
        try {
            productReviews = [
                    SELECT Id, CreatedBy.Name, CreatedDate, Name, CreatedById, Rating__c, Comment__c, Product_Id__c
                    FROM Product_Review__c
                    WHERE Product_Id__c = :productId
                    ORDER BY CreatedDate DESC
            ];
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
        return productReviews;
    }

    @AuraEnabled
    public static Double getAverageRating(String productId) {
        Double sum = 0;
        List<Product_Review__c> productReviews = getProductReviews(productId);
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