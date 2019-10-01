({
    init: function(component, event, helper) {
        helper.doInit(component, event, helper);
    },

    create: function(component, event, helper) {
        helper.doSelectPriceBook(component, event, helper);
    },

    clickOpenEditProduct: function(component, event, helper) {
        component.set("v.isOpenEditModal", true);
    },

    clickEditProduct: function(component, event, helper) {
        helper.doEditProduct(component);
    },

    clickCloseEditModal: function(component, event, helper) {
        helper.doEditProduct(component);
    },

    clickDeleteProduct: function(component, event, helper) {
        helper.doDeleteProduct(component);
    },

    clickCloseDeleteModal: function(component, event, helper) {
        component.set("v.isOpenDeleteModal", false);
    },

    clickRemoveProduct: function(component, event, helper) {
        helper.doRemoveProduct(component);
    },

    clickCloseEditModal: function(component, event, helper) {
        component.set("v.isOpenEditModal", false);
    },
    clickCloseAddModal: function(component, event, helper) {
        component.set("v.isOpenAddModal", false);
    },

    clickOpenAddModal: function(component, event, helper) {
        helper.doOpenAddModal(component);
    },

    clickProductCheckbox: function(component, event, helper) {
        helper.doProductCheckbox(component, event);
    },

    clickAddSelectedProducts: function(component, event, helper) {
        helper.doAddSelectedProducts(component);
    },

    setCurrentOrderItemId: function(component, event, helper) {
        let selectedSection = event.currentTarget;
        let orderItemId = selectedSection.dataset.id;
        console.log('===> orderItemId  ' + orderItemId);
        component.set("v.orderItemId", orderItemId);
        let allOrder = component.get("v.productList");
        allOrder.forEach(function (acc) {
            if(acc.Id == orderItemId) {
                component.set("v.currentOrderItem", acc);
            }
        })
    },
})