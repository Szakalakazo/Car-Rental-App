public class TCR_ProductWrapper {

    public class Product {
        @AuraEnabled
        public String Brand;
        @AuraEnabled
        public Object Cost;
        @AuraEnabled
        public String CreatedDate;
        @AuraEnabled
        public String Description;
        @AuraEnabled
        public Integer Doors_Number;
        @AuraEnabled
        public String Engine;
        @AuraEnabled
        public String Id;
        @AuraEnabled
        public String LastModifiedById;
        @AuraEnabled
        public String LastModifiedDate;
        @AuraEnabled
        public String Model;
        @AuraEnabled
        public String Name;
        @AuraEnabled
        public Object ProductCode;
        @AuraEnabled
        public String Production_Year;
        @AuraEnabled
        public String SystemModstamp;
    }

    @AuraEnabled
    public Double price;
    @AuraEnabled
    public Product product;
    @AuraEnabled
    public Double quantity;
    @AuraEnabled
    public Double totalPriceForItem;
    @AuraEnabled
    public String posterURL;

    public static List<TCR_ProductWrapper> parse(String json) {
        return (List<TCR_ProductWrapper>) System.JSON.deserialize(json, List<TCR_ProductWrapper>.class);
    }
}