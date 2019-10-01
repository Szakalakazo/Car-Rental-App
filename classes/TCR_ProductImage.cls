global with sharing class TCR_ProductImage {

    global static String POSTER_TYPE = 'poster';
    global static String IMAGE_TYPE = 'image';

    global class ProductImageWrapper {
        @AuraEnabled
        global ContentDistribution poster;
        @AuraEnabled
        global List<ContentDistribution> images;
    }

    @AuraEnabled
    global static ProductImageWrapper getProductImage(String recordId) {
        try {
            List<ContentDocumentLink> listOfDocumentLinks = [
                    SELECT ContentDocumentId
                    FROM ContentDocumentLink
                    WHERE LinkedEntityId = :recordId
            ];

            Set<Id> contentIds = new Set<Id>();
            for (ContentDocumentLink link : listOfDocumentLinks) {
                contentIds.add(link.ContentDocumentId);
            }

            List<ContentVersion> listOfContentVersions = [
                    SELECT Id, Type__c
                    FROM ContentVersion
                    WHERE ContentDocumentId IN :contentIds
                    AND FileType IN ('PNG', 'JPG', 'JPEG')
                    ORDER BY SystemModstamp DESC
            ];

            ProductImageWrapper pictures = new ProductImageWrapper();
            List<String> listOfPostersIds = new List<String>();
            Set<Id> contentVersionIds = new Set<Id>();

            for (ContentVersion version : listOfContentVersions) {
                if (version.Type__c == POSTER_TYPE) {
                    listOfPostersIds.add(version.Id);
                } else {
                    contentVersionIds.add(version.Id);
                }
            }

            if (!listOfPostersIds.isEmpty()) {
                List<ContentDistribution> listOfPosters = [
                        SELECT Id, DistributionPublicUrl, ContentDownloadUrl, ContentDocumentId
                        FROM ContentDistribution
                        WHERE ContentVersionId IN :listOfPostersIds
                ];
                for (ContentDistribution distribution : listOfPosters) {
                    pictures.poster = listOfPosters[0];
                }
            }

            List<ContentDistribution> distributions = [
                    SELECT Id, DistributionPublicUrl, ContentDownloadUrl, ContentDocumentId
                    FROM ContentDistribution
                    WHERE ContentVersionId IN :contentVersionIds
            ];

            pictures.images = distributions;
            return pictures;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException('ERROR');
        }
    }

    @AuraEnabled
    global static void setImageType(String documentId, String imageType, String recordId) {
        try {
            if (imageType == POSTER_TYPE) {
                List<ContentDocumentLink> listOfDocumentLinks = [
                        SELECT ContentDocumentId
                        FROM ContentDocumentLink
                        WHERE LinkedEntityId = :recordId
                ];

                Set<Id> contentIds = new Set<Id>();
                for (ContentDocumentLink link : listOfDocumentLinks) {
                    contentIds.add(link.ContentDocumentId);
                }
                List<ContentVersion> listOfContentVersions = [
                        SELECT Id, Type__c, ContentDocumentId
                        FROM ContentVersion
                        WHERE ContentDocumentId
                                IN :contentIds AND Type__c LIKE :POSTER_TYPE
                ];

                if (!listOfContentVersions.isEmpty()) {
                    for (ContentVersion content : listOfContentVersions) {
                        content.Type__c = IMAGE_TYPE;
                    }
                    UPSERT listOfContentVersions;
                }
            }

            List<ContentVersion> listOfContentVersions = [
                    SELECT Id, Type__c
                    FROM ContentVersion
                    WHERE ContentDocumentId = :documentId
            ];

            if (imageType == IMAGE_TYPE) {
                ContentDistribution cd = new ContentDistribution();
                cd.Name = IMAGE_TYPE;
                cd.ContentVersionId = listOfContentVersions[0].Id;
                cd.PreferencesAllowViewInBrowser = true;
                cd.PreferencesLinkLatestVersion = true;
                cd.PreferencesNotifyOnVisit = false;
                cd.PreferencesPasswordRequired = false;
                cd.PreferencesAllowOriginalDownload = true;
                INSERT cd;
            }
            listOfContentVersions[0].Type__c = imageType;
            UPSERT listOfContentVersions[0];
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException('ERROR');
        }
    }

    @AuraEnabled
    global static void deleteDocument(String documentId) {
        try {
            ContentDocument doc = new ContentDocument(Id = documentId);
            DELETE doc;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException('ERROR');
        }
    }

}