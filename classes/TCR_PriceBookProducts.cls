public with sharing class TCR_PriceBookProducts {

    @AuraEnabled
    public static List<Pricebook2> getPriceBookList(String priceBookId) {
        return [SELECT Id, Name, IsActive, IsStandard FROM Pricebook2];
    }

    @AuraEnabled
    public static List<PricebookEntry> getAllPricebookEntry(String priceBookId) {
        return selectEntryProducts(new List<String>(), priceBookId);
    }

    public static List<PricebookEntry> selectEntryProducts(List<String> allProducts, String priceBookId) {
        List<PricebookEntry> resultsEntryProducts = new List<PricebookEntry>();
        System.debug('200 allProducts  ' + allProducts);
        System.debug('201 priceBookId  ' + priceBookId);
        if (allProducts.isEmpty()) {
            System.debug('202   ');
            resultsEntryProducts = [
                    SELECT Product2Id, Pricebook2Id, UnitPrice, Product2.Name,
                            Product2.Family, Discount_by_cash__c, Discount_by_percent__c,
                            Discount_Price__c
                    FROM PricebookEntry
                    WHERE Pricebook2Id = :priceBookId
//                    AND Product2.IsActive = true
                    ORDER BY Product2.Name ASC
            ];

        } else if (String.isBlank(priceBookId)) {
            System.debug('203   ');

            resultsEntryProducts = [
                    SELECT Product2Id, Pricebook2Id, UnitPrice, Product2.Name,
                            Product2.Family, Discount_by_cash__c, Discount_by_percent__c,
                            Discount_Price__c
                    FROM PricebookEntry
                    WHERE Product2.Id IN :allProducts
                    ORDER BY Product2.Id ASC
            ];
        } else {
            System.debug('204   ');

            resultsEntryProducts = [
                    SELECT Product2Id, Pricebook2Id, UnitPrice
                    FROM PricebookEntry
                    WHERE Product2Id IN :allProducts
                    AND Pricebook2Id = :priceBookId
//                    AND Product2.IsActive = true //todo
            ];
        }
        return resultsEntryProducts;
    }

    @AuraEnabled //todo
    public static List<Product2> getAllProducts() {
        return [
                SELECT Id, Brand__c, Model__c, Name
                FROM Product2
        ];
    }

    @AuraEnabled
    public static List<String> getAllCategoriesApex() {
        List<String> options = new List<String>();
        Schema.DescribeFieldResult fieldResult =
                Product2.Brand__c.getDescribe();
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
//                AND Pricebook2Id = :standardPriceBookId AND Product2.IsActive = true
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
            pricebookEntriesToInsert.add(oneProductEntry);
        }
        try {
            UPSERT pricebookEntriesToInsert;
        } catch (Exception ex) {
            System.debug('Failed with add new Product Entry message: ' + ex.getMessage());
            System.debug('Failed with add new Product Entry message: ' + ex.getCause());
        }
    }

    @AuraEnabled
    public static List<String> addNewPriceBook(String typeDiscount, Decimal discount, String category, String priceBookName) { // todo pobrac jeszcze ceny zeby je bylo od czeg odjac
        List<Product2> allProductFromGivenCategory = [
                SELECT Id, Name, Brand__c, Model__c
                FROM Product2
                WHERE Brand__c = :category
        ];
        List<Id> listOfProductIds = new List<Id>();
        for (Product2 item : allProductFromGivenCategory) {
            listOfProductIds.add(item.Id);
        }


        List<PricebookEntry> pricebookEntries = selectEntryProducts(listOfProductIds, '');
        for (PricebookEntry pricebookEntry : pricebookEntries) {
            System.debug('=================' + pricebookEntry);
        }
        Pricebook2 newPricebook2 = new Pricebook2();
        newPricebook2.Name = priceBookName;
        newPricebook2.IsActive = true;

        try {
            INSERT newPricebook2;
        } catch (Exception e) {
            System.debug('Wyjebalo sie ' + e.getCause());
        }

        Pricebook2 priceBook = [
                SELECT Id, Name
                FROM Pricebook2
                WHERE Name LIKE :priceBookName
        ][0];
        System.debug('ldldldl priceBook ' + priceBook);
        List<PricebookEntry> pricebookEntriesToInsert = new List<PricebookEntry>();

        for (PricebookEntry oneProductEntry : pricebookEntries) {
            oneProductEntry.Id = null;
            oneProductEntry.Pricebook2Id = priceBook.Id;
            pricebookEntriesToInsert.add(oneProductEntry);
            System.debug(' ---------------- ' + oneProductEntry);

        }

        /*for (Product2 item : allProductFromGivenCategory) {
            PricebookEntry newPricebookEntry = new PricebookEntry();
            oneProductEntry.Id = null;
            newPricebookEntry.Pricebook2Id = priceBook.Id;
            newPricebookEntry.Product2Id = item.Id;
            newPricebookEntry.UnitPrice = 0;
            pricebookEntriesToInsert.add(newPricebookEntry);

            item.Id = null;
            item.Pricebook2Id = priceBook.Id;
            pricebookEntriesToInsert.add(item);
        }*/
        try {
            INSERT pricebookEntriesToInsert;
        } catch (Exception e) {
            System.debug('Wyjebalo sie 1 ' + e.getCause());
            System.debug(e.getMessage());
        }
        return null;
    }

    @AuraEnabled
//    public static List<String> doAddNewDiscountCallout(String typeDiscount, Decimal discount, String category, String priceBookId) {
    public static List<String> doAddNewDiscountCallout(String typeDiscount, Decimal discount, String category) {
        List<String> categories = new List<String>();
        categories.add(category);

        List<Pricebook2> standardPricebook = [
                SELECT Id, IsStandard
                FROM Pricebook2
                WHERE IsStandard = true
        ] ;

        String standardPriceBookId = standardPricebook.get(0).Id;

        List<PricebookEntry> pricebookEntriesToInsert = new List<PricebookEntry>();

        List<String> allProducts = searchForIds('', categories);
        System.debug(' ------------> 114 all products ' + allProducts);

        List<PricebookEntry> resultsEntryProducts = selectEntryProducts(allProducts, standardPriceBookId);
        System.debug(' ------------> 115 resultsEntryProducts ' + resultsEntryProducts);

        if (typeDiscount.equalsIgnoreCase('Cash discount')) {
            for (PricebookEntry oneProduct : resultsEntryProducts) {
                oneProduct.Id = null;
//                oneProduct.Pricebook2Id = priceBookId;
                if (oneProduct.UnitPrice <= discount) {
                    oneProduct.Discount_by_cash__c = oneProduct.UnitPrice - 1;
                } else {
                    oneProduct.Discount_by_cash__c = discount;
                }
                pricebookEntriesToInsert.add(oneProduct);
            }
        } else if (typeDiscount.equalsIgnoreCase('Percentage discount')) {
            for (PricebookEntry oneProduct : resultsEntryProducts) {
                oneProduct.Id = null;
                oneProduct.Discount_by_percent__c = discount;
//                oneProduct.Pricebook2Id = priceBookId;
                pricebookEntriesToInsert.add(oneProduct);
            }
        }
        try {
            upsert pricebookEntriesToInsert;
        } catch (Exception ex) {
            System.debug('Failed with insert Product Entry message: ' + ex.getMessage());
            System.debug('Failed with insert Product Entry message: ' + ex.getCause());
        }
        return null;
    }

    @AuraEnabled
    public static List<String> searchForIds(String query, List<String> category) {
        List<Product2> resultsProducts = new List<Product2>();

        String newSearchText = '' + query + '%';
        if (!category.isEmpty()) {
            resultsProducts = [SELECT Id FROM Product2 WHERE Name LIKE :newSearchText AND Family IN :category AND IsActive = true];
        } else {
            String queryDataBase = 'SELECT Id FROM Product2 WHERE Name LIKE \'' + query + '%\' AND IsActive = true ORDER BY Name';
            resultsProducts = resultsProducts = Database.query(queryDataBase);
        }
        List<String> ids = new List<String>();
        for (Product2 product : resultsProducts) {
            ids.add(product.Id);
        }
        System.debug('ids  ' + ids);
        return ids;
    }
}