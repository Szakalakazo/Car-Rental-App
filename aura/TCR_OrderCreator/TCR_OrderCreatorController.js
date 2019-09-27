({
    doInit: function (component, event, helper) {
        helper.doInitAddress(component, event, helper);
    },

    showAddressSection: function (component) {
        let isAddressSectionVisible = component.get("v.isAddressSectionVisible");
        component.set("v.isAddressSectionVisible", !isAddressSectionVisible);
    },

    handleSubmitOrder: function (component, event, helper) {
        helper.createAnOrder(component, event, helper);
    },
})