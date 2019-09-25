({
    init: function(component, event, helper) {
        helper.doInit(component, event);
    },

    clickDeleteProduct: function(component, event, helper) {
        helper.doDeletePriceBook(component, event);
    },

    handleOpenModal: function (component, event, helper) {
        helper.fireEvent(component, event, helper);
    },

    setCurrentPriceBookItemId: function(component, event, helper) {
        let selectedSection = event.currentTarget;
        let pricebookItem = selectedSection.dataset.id;
        component.set("v.recordId", pricebookItem);
        let allOrder = component.get("v.recordList");
        allOrder.forEach(function (acc) {
            if(acc.Id == pricebookItem) {
                component.set("v.currentOrderItem", acc);
            }
        })
    },
})