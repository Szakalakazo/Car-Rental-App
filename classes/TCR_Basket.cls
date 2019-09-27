public with sharing class TCR_Basket {

    private static String userId;
    private static String userLoginName;
    private static final String ACCOUNT_ID = '0012p00002SfHxeAAF';
    private static final String ORDER_STATUS_DRAFT = 'Draft';
    private static final String ORDER_STATUS_ACTIVATED = 'Activated';
    private static final String STANDARD_PRICEBOOK_ID = '01t2p00000AH49VAAT';
    private static List<User> users;
    private static Account account;

    public TCR_Basket() {
        account = new Account();
        userId = UserInfo.getUserId();
        userLoginName = UserInfo.getUserName();
    }

    @AuraEnabled
    public static Order createOrder(String jsonString, Order orderDetails) {
        List<Pricebook2> standardPricebook = [SELECT Id, IsStandard FROM Pricebook2 WHERE IsStandard = true];
        String standardPriceBookId = standardPricebook.get(0).Id;
        Contract contract = createNewContract();
        Order order = new Order();
        order.AccountId = ACCOUNT_ID;
        order.ContractId = contract.Id;
        order.Pricebook2Id = TCR_ProductSearchController.getProductPrice(STANDARD_PRICEBOOK_ID).get(0).Pricebook2Id;
        order.EffectiveDate = Date.today();
        order.Status = ORDER_STATUS_DRAFT;
        order.ShippingStreet = orderDetails.ShippingStreet;
        order.ShippingPostalCode = orderDetails.ShippingPostalCode;
        order.ShippingCity = orderDetails.ShippingCity;
        order.ShippingState = orderDetails.ShippingState;
        order.ShippingCountry = orderDetails.ShippingCountry;

        try {
            INSERT order;
        } catch (Exception e) {
            System.debug(e.getMessage());
        }

        List<TCR_ProductWrapper> productWrapper = TCR_ProductWrapper.parse(jsonString);
        List<OrderItem> listOfOrderItems = new List<OrderItem>();

        for (TCR_ProductWrapper wrapper : productWrapper) {
            OrderItem newItem = new OrderItem();
            newItem.OrderId = order.Id;
            newItem.Product2Id = wrapper.product.Id;
            newItem.Quantity = wrapper.quantity;
            newItem.PricebookEntryId = TCR_ProductSearchController.getProductPrice(wrapper.product.Id).get(0).Id;
            newItem.UnitPrice = wrapper.price;
            listOfOrderItems.add(newItem);
        }
        try {
            updateContract(contract);
            INSERT listOfOrderItems;
            order.Status = ORDER_STATUS_ACTIVATED;
        } catch (Exception ex) {
            System.debug('Failed with create order message: ' + ex.getMessage());
        }
        return order;
    }

    public static Contract createNewContract() {
        Contract contract = new Contract();
        contract.AccountId = ACCOUNT_ID;
        contract.Status = ORDER_STATUS_DRAFT;
        contract.StartDate = Date.today();
        contract.ContractTerm = 12;
        try {
            INSERT contract;
        } catch (Exception ex) {
            System.debug('Failed with createNewContract' + ex.getMessage() + ex.getMessage());
        }
        contract = updateContract(contract);
        return contract;
    }

    private static Contract updateContract(Contract contract) {
        contract.Status = ORDER_STATUS_ACTIVATED;
        try {
            UPSERT contract;
        } catch (Exception ex) {
            System.debug('Failed with createNewContract' + ex.getMessage());
        }
        return contract;
    }
}