public class TCR_PriceBookWrapper {

    @AuraEnabled
    public String typeOfDiscount;

    @AuraEnabled
    public String category;

    @AuraEnabled
    public String priceBookName;

    @AuraEnabled
    public Double cashValue;

    @AuraEnabled
    public Double percentageValue;

    @AuraEnabled
    public Date startDate;

    @AuraEnabled
    public Date endDate;

    public static TCR_PriceBookWrapper parse(String json) {
        return (TCR_PriceBookWrapper) System.JSON.deserialize(json, TCR_PriceBookWrapper.class);
    }
}