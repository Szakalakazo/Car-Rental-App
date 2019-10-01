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


    @AuraEnabled
    public static void insertProductVote(String idProduct, Decimal oneVote) {
        List<Product_Vote__c> listOfProductVotes = [
                SELECT Id, Vote_average__c, Vote_count__c, Vote_sum__c
                FROM Product_Vote__c
                WHERE Movie_Id__c = :idProduct
        ];
        Product_Vote__c newProductVote = new Product_Vote__c();
        if (!listOfProductVotes.isEmpty()) {
            listOfProductVotes.get(0).Vote_sum__c += oneVote;
            listOfProductVotes.get(0).Vote_count__c++;
            UPSERT listOfProductVotes.get(0);
        } else {
            newProductVote.Vote_sum__c = oneVote;
            newProductVote.Movie_Id__c = idProduct;
            newProductVote.Vote_count__c = 1;
            insert newProductVote;
        }
    }


}