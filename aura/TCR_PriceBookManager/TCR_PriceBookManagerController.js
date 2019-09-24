({
    init: function(component, event, helper) {
        helper.doGetAllCategories(component, event);
    },

    clickCreateNewDiscount: function(component, event, helper) {
        helper.doCreateNewDiscount(component, event);
    },

    clickTypeDiscount: function(component, event, helper) {
        helper.doTypeDiscount(component, event);
    },

    clickTypeProduct: function(component, event, helper) {
        helper.doTypeProduct(component, event);
    },

    clickAddNewDiscountCategory: function(component, event, helper) {
        helper.doAddNewDiscountCategory(component, event);
    },

    clickAddNewDiscountAll: function(component, event, helper) {
        helper.doAddNewDiscountAll(component, event);
    },

})