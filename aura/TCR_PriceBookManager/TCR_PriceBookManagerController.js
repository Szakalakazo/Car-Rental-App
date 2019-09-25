({
    init: function (component, event, helper) {
        helper.doGetAllCategories(component, event);
        helper.doGetAllProducts(component, event);
    },

    clickTypeDiscount: function (component, event, helper) {
        helper.doSelectDiscountType(component, event);
    },

    clickTypeProduct: function (component, event, helper) {
        helper.doSelectProductType(component, event);
    },

    clickAddNewDiscount: function (component, event, helper) {
        helper.doAddNewDiscount(component, event);
    },

    toggleSearchModal: function (component, event, helper) {
        let isSearchModalOpen = component.get("v.isSearchModalOpen");
        component.set('v.isSearchModalOpen', !isSearchModalOpen);
        helper.switchSpinner(component, !isSearchModalOpen)
    },

    setCurrentOrderItemId: function (component, event, helper) {
        let selectedSection = event.currentTarget;
        let orderItemId = selectedSection.dataset.id;
        component.set("v.orderItemId", orderItemId);
        let allOrder = component.get("v.productList");
        allOrder.forEach(function (acc) {
            if (acc.Id == orderItemId) {
                component.set("v.currentOrderItem", acc);
            }
        })
    },

    clickProductCheckbox: function (component, event, helper) {
        helper.doSelectProductCheckbox(component, event, helper);
    },

    clickAddSelectedProducts: function (component, event, helper) {
        helper.doAddSelectedProductsToNewPriceBook(component);
    },

    handleSearchProduct: function (component, event, helper) {
        helper.doSearchProduct(component);
    },

    doShowPriceBookDetails:function (component, event, helper) {
        component.set("v.isPriceBookDetailsOpen", true);
    },
    doHidePriceBookDetails:function (component, event, helper) {
        console.log('handling delete');
        component.set("v.isPriceBookDetailsOpen", false);
    },

})