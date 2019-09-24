({
    init: function(component, event, helper) {
        helper.doGetAllCategories(component, event);
        helper.doGetAllProducts(component, event);
    },

    clickTypeDiscount: function(component, event, helper) {
        helper.doTypeDiscount(component, event);
    },

    clickTypeProduct: function(component, event, helper) {
        helper.doTypeProduct(component, event);
    },

    clickAddNewDiscount: function(component, event, helper) {
        helper.doAddNewDiscount(component, event);
    },

    toggleSearchModal: function(component, event, helper) {
        let isSearchModalOpen = component.get("v.isSearchModalOpen");
        component.set('v.isSearchModalOpen', !isSearchModalOpen);
        helper.switchSpinner(component, !isSearchModalOpen)
    },
})