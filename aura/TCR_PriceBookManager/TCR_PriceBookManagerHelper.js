({
    doInit: function (component, event) {
        let priceBookId = component.get("v.recordId");
        let getActualProductsAction = component.get("c.selectActualProducts");
        getActualProductsAction.setParam("priceBookId", priceBookId);
        getActualProductsAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let returnList = response.getReturnValue();
                // this.switchSpinner(component, false);
            } else {
                console.log("getActualOrderItemAction Failed with state: " + state);
            }
        });
        $A.enqueueAction(getActualProductsAction);
        // this.doGetAllCategories(component, event);
        this.switchSpinner(component, true);
    },

    doGetAllCategories: function (component, event) {
        let action = component.get("c.getAllCategoriesApex");
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let allCategories = response.getReturnValue();
                component.set("v.allCategories", allCategories);
                this.switchSpinner(component, false);
            }
        });
        $A.enqueueAction(action);
        this.switchSpinner(component, true);
    },

    doCreateNewDiscount: function (component, event) {
        let priceBookId = component.get("v.recordId");
    },

    doTypeDiscount: function (component, event) {
        let selectedValue = component.find("selectedTypeDiscount").get("v.value");
        console.log("selectedValue" + selectedValue);
        if (selectedValue && selectedValue === "Cash discount") {
            component.set("v.cashDiscount", true);
            component.set("v.percentageDiscount", false);
            component.set("v.percentageValue", 0);
        } else if (selectedValue === "Percentage discount") {
            component.set("v.percentageDiscount", true);
            component.set("v.cashDiscount", false);
            component.set("v.cashValue", 0);
        } else if (selectedValue === "None") {
            component.set("v.percentageDiscount", false);
            component.set("v.cashDiscount", false);
            component.set("v.productCategory", false);
            component.set("v.selectedAllCategory", false);
            component.set("v.percentageValue", 0);
            component.set("v.cashValue", 0);
        } else {
            console.error("Component selectedTypeDiscount not exist");
        }
    },

    doTypeProduct: function (component, event) {
        let selectedValue = component.find("selectedTypeProduct").get("v.value");
        if (selectedValue && selectedValue === "ProductsByCategory") {
            component.set("v.productCategory", true);
            component.set("v.selectedAllCategory", false);
        } else if (selectedValue === "AllProducts") {
            component.set("v.productCategory", false);
            component.set("v.selectedAllCategory", true);
        } else {
            console.error("Component selectedTypeDiscount not exist");
        }
    },

    doAddNewDiscountCategory: function (component, event) {
        let selectedValue = component.find("selectedTypeProduct").get("v.value");
        let typeOfDiscount = component.find("selectedTypeDiscount").get("v.value");
        let category = component.find("selectedCategory").get("v.value");
        let cashValue = component.get("v.cashValue");
        let percentageValue = component.get("v.percentageValue");

        if (typeOfDiscount === "Cash discount" && Number(cashValue) > 0) {
            this.doAddNewDiscount(component, typeOfDiscount, cashValue, category);
        } else if (typeOfDiscount === "Percentage discount" && percentageValue) {
            this.doAddNewDiscount(component, typeOfDiscount, percentageValue, category);
        } else {
            this.doShowToast(component, "Fill required fields", "Warning", "Warning");
        }
    },

    doAddNewDiscountAll: function (component, event) {
        let selectedValue = component.find("selectedTypeProduct").get("v.value");
        let typeOfDiscount = component.find("selectedTypeDiscount").get("v.value");
        let cashValue = component.get("v.cashValue");
        let percentageValue = component.get("v.percentageValue");

        if (typeOfDiscount === "Cash discount" && cashValue) {
            this.doAddNewDiscount(component, typeOfDiscount, cashValue, '');
        } else if (typeOfDiscount === "Percentage discount" && percentageValue) {
            this.doAddNewDiscount(component, typeOfDiscount, percentageValue, '');
        } else {
            this.doShowToast(component, "Fill required fields", "Warning", "Warning");
        }
    },

    doAddNewDiscount: function (component, typeDiscount, discount, category) {
        let priceBookId = component.get("v.recordId");
        let doAddNewDiscountAction = component.get("c.addNewPriceBook"); //todo zmiana metody

        doAddNewDiscountAction.setParam("typeDiscount", typeDiscount);
        doAddNewDiscountAction.setParam("discount", discount);
        doAddNewDiscountAction.setParam("category", category);
        doAddNewDiscountAction.setParam("priceBookName", 'SampleName');
        doAddNewDiscountAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let doAddNewDiscountEvent = $A.get("e.c:TCR_PriceBookRefreshEvent");
                doAddNewDiscountEvent.fire();
                component.set("v.productCategory", false);
                component.set("v.selectedAllCategory", false);
                component.set("v.percentageDiscount", false);
                component.set("v.cashDiscount", false);
                this.switchSpinner(component, false);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(doAddNewDiscountAction);
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