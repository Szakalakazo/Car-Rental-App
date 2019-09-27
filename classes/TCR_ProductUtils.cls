/**
 * Created by Tomek on 27.09.2019.
 */

global with sharing class TCR_ProductUtils {
    @AuraEnabled
    global Integer page { get; set; }
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
        global Boolean video { get; set; }
        @AuraEnabled
        global Double vote_average { get; set; }
        @AuraEnabled
        global String title { get; set; }
        @AuraEnabled
        global Double popularity { get; set; }
        @AuraEnabled
        global String poster_path { get; set; }
        @AuraEnabled
        global String original_language { get; set; }
        @AuraEnabled
        global String original_title { get; set; }
        @AuraEnabled
        global List<Integer> genre_ids { get; set; }
        @AuraEnabled
        global String backdrop_path { get; set; }
        @AuraEnabled
        global Boolean adult { get; set; }
        @AuraEnabled
        global String overview { get; set; }
        @AuraEnabled
        global String release_date { get; set; }
        @AuraEnabled
        global Boolean blackList { get; set; }
        @AuraEnabled
        global Boolean favourites { get; set; }
        @AuraEnabled
        global Boolean isActive { get; set; }
    }
}