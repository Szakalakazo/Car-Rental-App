public with sharing class TCR_PriceBookProducts {

    public static final String  CASH_DISCOUNT_TYPE = 'Cash discount';
    public static final String  PERCENTAGE_DISCOUNT_TYPE = 'Percentage discount';

    public class ProductWrapper {
        public Product2 product;
        public Boolean isSelected;

        public ProductWrapper(Product2 product, Boolean isSelected) {
            this.product = product;
            this.isSelected = isSelected;
        }
    }

    @AuraEnabled
    public static String findByName(String searchKey) {
        String name = '%' + searchKey + '%';
        List<ProductWrapper> listOfProductWrappers = new List<TCR_PriceBookProducts.ProductWrapper>();

        List<Product2> listOfAllProducts = [
                SELECT Id, Brand__c, Model__c, Name
                FROM Product2
                WHERE Name LIKE :name
        ] ;
        for (Product2 productItem : listOfAllProducts) {
            ProductWrapper wrapper = new ProductWrapper(productItem, false);
            listOfProductWrappers.add(wrapper);
        }
        return JSON.serialize(listOfProductWrappers);

    }

    @AuraEnabled
    public static String getAllProducts() {
        List<Product2> listOfAllProducts = [
                SELECT Id, Brand__c, Model__c, Name
                FROM Product2
        ];

        List<ProductWrapper> listOfProductWrappers = new List<TCR_PriceBookProducts.ProductWrapper>();
        for (Product2 productItem : listOfAllProducts) {
            ProductWrapper wrapper = new ProductWrapper(productItem, false);
            listOfProductWrappers.add(wrapper);
        }
        return JSON.serialize(listOfProductWrappers);
    }

    @AuraEnabled
    public static List<Pricebook2> getPriceBookList(String priceBookId) {
        return [
                SELECT Description, Id, IsActive, IsStandard, Name, Start_Date__c, End_Date__c
                FROM Pricebook2
        ];
    }

    @AuraEnabled
    public static List<PricebookEntry> getAllPricebookEntry(String priceBookId) {
        return selectEntryProducts(new List<String>(), priceBookId);
    }

    @AuraEnabled
    public static List<PricebookEntry> selectEntryProducts(List<String> allProducts, String priceBookId) {
        List<PricebookEntry> resultsEntryProducts = new List<PricebookEntry>();
        if (allProducts.isEmpty()) {
            resultsEntryProducts = [
                    SELECT Product2Id, Pricebook2Id, UnitPrice, Product2.Name,
                            Product2.Family, Discount_by_cash__c, Discount_by_percent__c,
                            Discount_Price__c
                    FROM PricebookEntry
                    WHERE Pricebook2Id = :priceBookId
                    ORDER BY Product2.Name ASC
            ];
        } else if (String.isBlank(priceBookId)) {
            resultsEntryProducts = [
                    SELECT Product2Id, Pricebook2Id, UnitPrice, Product2.Name,
                            Product2.Family, Discount_by_cash__c, Discount_by_percent__c,
                            Discount_Price__c
                    FROM PricebookEntry
                    WHERE Pricebook2.IsStandard = true
                    AND Product2.Id IN :allProducts

                    ORDER BY Product2.Id ASC
            ];
        } else {
            resultsEntryProducts = [
                    SELECT Product2Id, Pricebook2Id, UnitPrice
                    FROM PricebookEntry
                    WHERE Product2Id IN :allProducts
                    AND Pricebook2Id = :priceBookId
            ];
        }
        return resultsEntryProducts;
    }

    @AuraEnabled
    public static List<String> getAllCategoriesApex() {
        List<String> options = new List<String>();
        Schema.DescribeFieldResult fieldResult = Product2.Brand__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry f : ple) {
            options.add(f.getValue());
        }
        return options;
    }

    @AuraEnabled
    public static void deleteOrderProduct(String orderItemId) {
        PricebookEntry pricebookEntry = new PricebookEntry();
        pricebookEntry.Id = orderItemId;
        try {
            DELETE pricebookEntry;
        } catch (Exception e) {
            System.debug(e.getMessage());
            System.debug(e.getCause());
        }
    }

    @AuraEnabled
    public static void editOrderProductItem(PricebookEntry currentOrderItem) {
        UPSERT currentOrderItem;
    }

    @AuraEnabled
    public static List<PricebookEntry> getNotRelatedProduct(String priceBookId) {
        List<Pricebook2> standardPricebook = [
                SELECT Id, IsStandard
                FROM Pricebook2
                WHERE IsStandard = true
        ];
        String standardPriceBookId = standardPricebook.get(0).Id;
        List<PricebookEntry> currentProductEntryInPriceBook = getAllPricebookEntry(priceBookId);
        List<String> productsEntryIds = new List<String>();

        for (PricebookEntry pricebookEntry : currentProductEntryInPriceBook) {
            productsEntryIds.add(pricebookEntry.Product2Id);
        }
        List<PricebookEntry> availableProductEntry = [
                SELECT Product2Id, Pricebook2Id, UnitPrice, Product2.Name, Product2.Family
                FROM PricebookEntry
                WHERE Product2Id NOT IN :productsEntryIds
        ];
        return availableProductEntry;
    }

    @AuraEnabled
    public static void addNewProductToPriceBook(List<String> selectedProductIds, String priceBookId) {
        List<PricebookEntry> pricebookEntriesToInsert = new List<PricebookEntry>();
        List<Pricebook2> standardPricebook = [
                SELECT Id, IsStandard
                FROM Pricebook2
                WHERE IsStandard = true
        ];
        String standardPriceBookId = standardPricebook.get(0).Id;
        List<PricebookEntry> pricebookEntries = selectEntryProducts(selectedProductIds, standardPriceBookId);
        for (PricebookEntry oneProductEntry : pricebookEntries) {
            oneProductEntry.Id = null;
            oneProductEntry.Pricebook2Id = priceBookId;
            oneProductEntry.IsActive = true;
            pricebookEntriesToInsert.add(oneProductEntry);
        }
        try {
            UPSERT pricebookEntriesToInsert;
        } catch (Exception ex) {
            System.debug('Failed with add new Product Entry message: ' + ex.getCause());
        }
    }

    @AuraEnabled
    public static Pricebook2 addNewPriceBook(String newPriceBook) {
        TCR_PriceBookWrapper priceBookWrapper = TCR_PriceBookWrapper.parse(newPriceBook);
        List<Product2> allProductFromGivenCategory = new List<Product2>();

        if (String.isNotBlank(priceBookWrapper.category)) {
            allProductFromGivenCategory = [
                    SELECT Id, Name, Brand__c, Model__c
                    FROM Product2
                    WHERE Brand__c = :priceBookWrapper.category
            ];
        } else {
            allProductFromGivenCategory = [
                    SELECT Id, Name, Brand__c, Model__c
                    FROM Product2
            ];
        }
        return insertPriceBookEntriesToDB(allProductFromGivenCategory, newPriceBook);
    }

    @AuraEnabled
    public static void addNewPriceBookWithListOfProducts(String newPriceBook, List<String> selectedProductIds) {
        TCR_PriceBookWrapper priceBookWrapper = TCR_PriceBookWrapper.parse(newPriceBook);
        List<Product2> allSelectedProducts = [
                SELECT Id
                FROM Product2
                WHERE Id IN :selectedProductIds
        ];
        insertPriceBookEntriesToDB(allSelectedProducts, newPriceBook);
    }

    @AuraEnabled
    public static void deletePriceBook(String priceBookId) {
        List<Pricebook2> listOfPricebook = [SELECT Id FROM Pricebook2 WHERE Id = :priceBookId];
        DELETE listOfPricebook;
    }

    private static Pricebook2 createAndInsertNewPricebook(String newPriceBook) {
        TCR_PriceBookWrapper priceBookWrapper = TCR_PriceBookWrapper.parse(newPriceBook);
        Pricebook2 newPricebook2 = new Pricebook2();
        newPricebook2.Name = priceBookWrapper.priceBookName;
        newPricebook2.IsActive = true;
        newPricebook2.Start_Date__c = priceBookWrapper.startDate;
        newPricebook2.End_Date__c = priceBookWrapper.endDate;
        try {
            INSERT newPricebook2;
        } catch (Exception e) {
            System.debug(e.getCause());
        }
        return [
                SELECT Id, Name
                FROM Pricebook2
                WHERE Name LIKE :priceBookWrapper.priceBookName
        ][0];
    }

    private static Pricebook2 insertPriceBookEntriesToDB(List<Product2> listOfProduct, String newPriceBook) {
        TCR_PriceBookWrapper priceBookWrapper = TCR_PriceBookWrapper.parse(newPriceBook);

        List<Id> listOfProductIds = new List<Id>();
        for (Product2 item : listOfProduct) {
            listOfProductIds.add(item.Id);
        }

        List<PricebookEntry> pricebookEntries = selectEntryProducts(listOfProductIds, '');
        Pricebook2 priceBook = createAndInsertNewPricebook(newPriceBook);
        List<PricebookEntry> pricebookEntriesToInsert = new List<PricebookEntry>();

        if (priceBookWrapper.typeOfDiscount.equalsIgnoreCase(CASH_DISCOUNT_TYPE)) {
            for (PricebookEntry oneProductEntry : pricebookEntries) {
                oneProductEntry.Id = null;
                oneProductEntry.Pricebook2Id = priceBook.Id;
                oneProductEntry.IsActive = true;
                if (oneProductEntry.UnitPrice <= priceBookWrapper.cashValue) {
                    oneProductEntry.Discount_by_cash__c = oneProductEntry.UnitPrice - 1;
                } else {
                    oneProductEntry.Discount_by_cash__c = priceBookWrapper.cashValue;
                }
                pricebookEntriesToInsert.add(oneProductEntry);
            }
        } else if (priceBookWrapper.typeOfDiscount.equalsIgnoreCase(PERCENTAGE_DISCOUNT_TYPE)) {
            for (PricebookEntry oneProductEntry : pricebookEntries) {
                oneProductEntry.Id = null;
                oneProductEntry.Pricebook2Id = priceBook.Id;
                oneProductEntry.IsActive = true;
                oneProductEntry.Discount_by_percent__c = priceBookWrapper.percentageValue;
                pricebookEntriesToInsert.add(oneProductEntry);
            }
        }
        try {
            INSERT pricebookEntriesToInsert;
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return priceBook;

    }
}