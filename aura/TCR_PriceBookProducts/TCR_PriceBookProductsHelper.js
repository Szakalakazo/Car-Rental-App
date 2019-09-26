({
    doInit: function (component, event, helper) {
        let priceBookId = component.get("v.recordId");
        let getActualProductAction = component.get("c.getAllPricebookEntry");
        getActualProductAction.setParam("priceBookId", priceBookId);
        getActualProductAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.productList", response.getReturnValue());
                this.switchSpinner(component, false);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(getActualProductAction);
        this.switchSpinner(component, true);
    },

    doSelectPriceBook: function (component, event, helper) {
        let priceBookId = event.getParam('priceBookId');
        component.set('v.recordId', priceBookId);
        let getActualProductAction = component.get("c.getAllPricebookEntry");
        getActualProductAction.setParam("priceBookId", priceBookId);
        getActualProductAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.productList", response.getReturnValue());
                this.switchSpinner(component, false);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(getActualProductAction);
        this.switchSpinner(component, true);
    },

    doEditProduct: function (component) {
        let currentOrderItem = component.get("v.currentOrderItem");
        let isCashContainComma = String(currentOrderItem.Discount_by_percent__c).includes(",");
        let isCashContainDot = String(currentOrderItem.Discount_by_percent__c).includes(".");
        let isPercentContainComma = String(currentOrderItem.Discount_by_cash__c).includes(",");
        let isPercentContainDot = String(currentOrderItem.Discount_by_cash__c).includes(".");
        if (currentOrderItem.Discount_by_percent__c >= 0 && currentOrderItem.Discount_by_percent__c < 100
            && currentOrderItem.Discount_by_cash__c >= 0 && currentOrderItem.Discount_by_cash__c < currentOrderItem.UnitPrice
            && !isCashContainComma && !isCashContainDot && !isPercentContainComma && !isPercentContainDot) {
            let editOrderProductAction = component.get("c.editOrderProductItem");
            editOrderProductAction.setParam("currentOrderItem", currentOrderItem);
            editOrderProductAction.setCallback(this, function (response) {
                let state = response.getState();
                if (state === "SUCCESS") {
                    this.switchSpinner(component, false);
                    this.doInit(component);
                    component.set("v.isOpenEditModal", false);
                } else {
                    this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
                }
            });
            $A.enqueueAction(editOrderProductAction);
            this.switchSpinner(component, true);
        } else {
            this.doShowToast(component, 'Fill correctly all fields, please', 'Warning', 'Warning');
        }
    },

    doRemoveProduct: function (component) {
        let currentOrderItemId = component.get("v.orderItemId");
        let deleteOrderProductAction = component.get("c.deleteOrderProduct");
        deleteOrderProductAction.setParam("orderItemId", currentOrderItemId);
        deleteOrderProductAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.switchSpinner(component, false);
                this.doInit(component);
                component.set("v.isOpenDeleteModal", false);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(deleteOrderProductAction);
        this.switchSpinner(component, true);
    },

    doDeleteProduct: function (component) {
        component.set("v.isOpenDeleteModal", true);
    },

    doProductCheckbox: function (component, event) {
        let selectedCheckBoxes = component.get("v.selectedCheckBoxes");
        let selectedValue = event.getSource().get("v.value");
        let selectedValueChecked = event.getSource().get("v.checked");
        if (selectedValueChecked) {
            selectedCheckBoxes.push(selectedValue);
        } else {
            for (let i = 0; i < selectedCheckBoxes.length; i++) {
                if (selectedCheckBoxes[i] === selectedValue) {
                    selectedCheckBoxes.splice(i, 1);
                }
            }
        }
        component.set("v.selectedCheckBoxes", selectedCheckBoxes);
    },

    doOpenAddModal: function (component) {
        component.set("v.isOpenAddModal", true);
        let priceBookId = component.get("v.recordId");
        let getNotRelatedProductAction = component.get("c.getNotRelatedProduct");
        getNotRelatedProductAction.setParam("priceBookId", priceBookId);
        getNotRelatedProductAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.switchSpinner(component, false);
                this.doInit(component);
                component.set("v.notRelatedProductList", response.getReturnValue());
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(getNotRelatedProductAction);
        this.switchSpinner(component, true);
    },

    doAddSelectedProducts: function (component) {
        let selectedProductIds = component.get("v.selectedCheckBoxes");
        let priceBookId = component.get("v.recordId");
        let addNewProductAction = component.get("c.addNewProductToPriceBook");
        addNewProductAction.setParam("priceBookId", priceBookId);
        addNewProductAction.setParam("selectedProductIds", selectedProductIds);
        addNewProductAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.switchSpinner(component, false);
                this.doInit(component);
                component.set("v.isOpenAddModal", false);
                component.set("v.selectedCheckBoxes", []);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(addNewProductAction);
        this.switchSpinner(component, true);
    },

    doShowToast: function (component, message, title, typeToast) {
        const toastComponent = component.find('toast');
        if (toastComponent) {
            toastComponent.showToast(message, title, typeToast);
        } else {
            console.error("'Toast Component' does not exist");
        }
    },

    switchSpinner: function (component, status) {
        const spinnerComponent = component.find('spinner');
        if (spinnerComponent) {
            spinnerComponent.switchSpinner(status);
        } else {
            console.error("'spinner' does not exist");
        }
    },
})