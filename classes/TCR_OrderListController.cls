public with sharing class TCR_OrderListController {

    @AuraEnabled
    public static List<Order> getOrderList() {
        List<Order> ordersList = [
                SELECT Id, Status, EffectiveDate, TotalAmount, (SELECT Id, UnitPrice, Quantity, TotalPrice, OrderId, Product2Id, Product2.Name FROM OrderItems)
                FROM Order
                WHERE OwnerId =: UserInfo.getUserId()
                ORDER BY EffectiveDate DESC
        ];
        return ordersList;
    }
}