public with sharing class TCR_ProductDetailController {

    @AuraEnabled
    public static List<String> getProductImages(Id productIdInApex) {
        List<String> listOfImageUrls = new List<String>();
        List<Product_Image__c> listOfProductImages = [
                SELECT Id, Image_Link__c
                FROM Product_Image__c
                WHERE Product__c = :productIdInApex
        ];

        if (!listOfProductImages.isEmpty()) {
            for (Product_Image__c image : listOfProductImages) {
                String imgUrl = image.Image_Link__c.substringBetween(' src="', '"').unescapeHtml4();
                listOfImageUrls.add(imgUrl);
            }
        }
        return listOfImageUrls;
    }
}