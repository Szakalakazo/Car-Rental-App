global with sharing class TCR_ProductUtils {
    @AuraEnabled
    global Integer total_results { get; set; }
    @AuraEnabled
    global Integer total_pages { get; set; }
    @AuraEnabled
    global List<Results> results { get; set; }

    global class Results {
        @AuraEnabled
        global Integer vote_count { get; set; }
        @AuraEnabled
        global String id { get; set; }
        @AuraEnabled
        global Double vote_average { get; set; }
        @AuraEnabled
        global String title { get; set; }
    }
}