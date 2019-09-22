public with sharing class TCR_BasketDetails {

   @AuraEnabled
    public static List<OrderItem> selectActualOrderItem() {
        Order order = TCR_Basket.selectActualOrder();
//        List<OrderItem> ordersItems = [SELECT Id, OrderId, Product2Id, Order.TotalAmount, Product2.Name, Quantity, UnitPrice, TotalPrice FROM OrderItem WHERE OrderId = :order.Id];
        List<OrderItem> ordersItems = [
                SELECT Id, OrderId, Product2Id, Order.TotalAmount, Product2.Name, Quantity, UnitPrice, TotalPrice
                FROM OrderItem
                WHERE OrderId = :order.Id
        ];
        return ordersItems;
//       return null;
    }

    @AuraEnabled
    public static List<OrderItem> deleteOrderItem(String orderItemId, String orderId, Integer quantityOrder) {
        List<Order> orders = [SELECT Id, OrderItem__c FROM Order WHERE Id = :orderId LIMIT 1];
        orders.get(0).OrderItem__c -= quantityOrder;
        upsert orders.get(0);

        OrderItem orderItem = new OrderItem();
        orderItem.Id = orderItemId;
        try {
            delete orderItem;
        } catch (Exception ex) {
            System.debug('Failed with delete order item message: ' + ex.getMessage());
            System.debug('Failed with delete order item cause: ' + ex.getCause());
        }
        return selectActualOrderItem();
    }

    @AuraEnabled
    public static void checkOutOrder(String orderId) {
        Order order = new Order();
        order.Id = orderId;
        order.Status = 'In Progress';
        try {
            upsert order;
        } catch (Exception ex) {
            System.debug('Failed with checkOut order item message: ' + ex.getMessage());
            System.debug('Failed with checkOut order item cause: ' + ex.getCause());
        }
    }
}