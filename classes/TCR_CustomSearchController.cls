public with sharing class TCR_CustomSearchController {

    public class SearchResultWrapper {
        @AuraEnabled
        public Product2 product = new Product2();
        @AuraEnabled
        public List<PricebookEntry> price = new List<PricebookEntry>();
    }

    @AuraEnabled
    public static List<SearchResultWrapper> searchForIds(String searchText) {
        try {
            List<List<SObject>> results = [FIND :searchText IN ALL FIELDS RETURNING Product2(Id, Name, Brand__c, Model__c, Production_Year__c, Engine__c, Doors_Number__c)];
            List<String> listOfIds = new List<String>();
            List<SearchResultWrapper> searchResults = new List<SearchResultWrapper>();
            for (List<SObject> sobjs : results) {
                for (SObject sobj : sobjs) {
                    listOfIds.add(sobj.Id);
                    SearchResultWrapper item = new SearchResultWrapper();
                    item.product = (Product2) sobj;
                    searchResults.add(item);
                }
            }

            List<PricebookEntry> priceList = new List<PricebookEntry>();
            priceList = [
                    SELECT Id, Product2Id, Pricebook2Id, UnitPrice, IsActive, Discount_Price__c
                    FROM PricebookEntry
                    WHERE Product2Id IN :listOfIds
                    AND IsActive = true
                    ORDER BY Discount_Price__c DESC
            ];
            for (PricebookEntry entry : priceList) {
                for (SearchResultWrapper item : searchResults) {
                    if (entry.Product2Id == item.product.Id) {
                        item.price.add(entry);
                    }
                }
            }
            return searchResults;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException('Error');
        }
    }

    @AuraEnabled
    public static String getProductPoster(String recordId) {
        try {
            String posterUrl = '';
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
                    SELECT Id,Type__c
                    FROM ContentVersion
                    WHERE ContentDocumentId IN :contentIds
                    AND FileType IN ('JPG', 'JPEG', 'PNG')
                    AND Type__c = 'poster'
            ];

            if (!listOfContentVersions.isEmpty()) {
                List<ContentDistribution> distributions = [
                        SELECT Id, DistributionPublicUrl, ContentDownloadUrl, ContentDocumentId
                        FROM ContentDistribution
                        WHERE ContentVersionId = :listOfContentVersions.get(0).Id
                ];

                posterUrl = distributions.get(0).ContentDownloadUrl;
            }
            return posterUrl;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException('ERROR');
        }
    }

    @AuraEnabled
    public static List<String> getBrands() {
        System.debug('getBrands');
        try {
            List<String> listOfBrands = new List<String>();
            Schema.DescribeFieldResult describeFieldResult = Product2.Brand__c.getDescribe();
            List<Schema.PicklistEntry> pickListEntries = describeFieldResult.getPicklistValues();

            for (Schema.PicklistEntry pickListVal : pickListEntries) {
                listOfBrands.add(pickListVal.getLabel());
            }
            return listOfBrands;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException('Error');
        }
    }
}