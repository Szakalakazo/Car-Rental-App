public with sharing class TCR_OrderListController {

    @AuraEnabled
    public static List<Order> getOrderList(){
//        Contract userContract = [SELECT Id FROM Contract WHERE CreatedById = :UserInfo.getUserId() LIMIT 1];
        Contract userContract = [SELECT Id FROM Contract WHERE CreatedById = '0052p000009s7DbAAI' LIMIT 1];
        List<Order> ordersList = [
                SELECT Id, Status, EffectiveDate, TotalAmount, (SELECT Id, UnitPrice, Quantity, TotalPrice, OrderId, Product2Id, Product2.Name FROM OrderItems) FROM Order WHERE ContractId = :userContract.Id ORDER BY EffectiveDate DESC];
        System.debug(ordersList);
        return ordersList;
    }
}