global class TCR_ProductDetailController {

    @AuraEnabled
    global static List<String> getProductImages(Id productIdInApex) {
        try {
            List<String> listOfImageUrls = new List<String>();

            List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productIdInApex];
            Set<Id> contentIds = new Set<Id>();
            System.debug('Doument link ' + documentLinks );

            for (ContentDocumentLink link : documentLinks) {
                contentIds.add(link.ContentDocumentId);
            }

            List<ContentVersion> contentVersions = [SELECT Id FROM ContentVersion WHERE ContentDocumentId IN :contentIds AND FileType IN('JPG', 'JPEG', 'PNG')];
            List<String> images = new List<String>();

            Set<Id> contentVersionIds = new Set<Id>();

            for (ContentVersion version : contentVersions) {
                contentVersionIds.add(version.Id);
            }

            List<ContentDistribution> listOfDistributions = [SELECT Id, DistributionPublicUrl, ContentDownloadUrl FROM ContentDistribution WHERE ContentVersionId IN :contentVersionIds];

            for (ContentDistribution distribution : listOfDistributions) {
                listOfImageUrls.add(distribution.ContentDownloadUrl);
                System.debug('>>>>>> distribution.ContentDownloadUrl ---> ' + distribution.ContentDownloadUrl);
            }

            return listOfImageUrls;
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return null;
    }
}