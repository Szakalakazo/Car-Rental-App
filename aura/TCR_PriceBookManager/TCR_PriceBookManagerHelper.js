({
    doGetAllProducts: function (component, event) {
        let action = component.get("c.getAllProducts");
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let allProducts = JSON.parse(response.getReturnValue());
                component.set("v.productEntryWrapperList", allProducts);
                console.log('allProducts --- > ' + allProducts);
            }
        });
        $A.enqueueAction(action);
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

    doTypeDiscount: function (component, event) {
        let selectedValue = component.find("selectedTypeDiscount").get("v.value");
        if (selectedValue && selectedValue === "Cash discount") {
            component.set("v.percentageDiscount", false);
            component.set("v.cashDiscount", true);
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
            component.set("v.customCategory", false);
        } else if (selectedValue === "AllProducts") {
            component.set("v.productCategory", false);
            component.set("v.selectedAllCategory", true);
            component.set("v.customCategory", false);
        } else if (selectedValue === "None") {
            component.set("v.productCategory", false);
            component.set("v.selectedAllCategory", false)
            component.set("v.customCategory", false)
        } else if (selectedValue === "Custom") {
            component.set("v.productCategory", false);
            component.set("v.selectedAllCategory", false)
            component.set("v.customCategory", true)
            console.log('else if ' + component.get("v.customCategory"));
        } else {
            console.error("Component selectedTypeDiscount not exist");
        }
    },

    doAddNewDiscount: function (component, helper, event) {
        let typeOfDiscount = component.find("selectedTypeDiscount").get("v.value");
        let selectedCategory = component.find("selectedCategory");
        let category;
        if (selectedCategory) {
            category = selectedCategory.get("v.value");
        }
        let priceBookName = component.get("v.priceBookName");
        let cashValue = component.get("v.cashValue");
        let percentageValue = component.get("v.percentageValue");
        let startDate = component.get("v.startDate");
        let endDate = component.get("v.endDate");

        let newPriceBook = {
            typeOfDiscount: typeOfDiscount,
            category: category,
            priceBookName: priceBookName,
            cashValue: cashValue,
            percentageValue: percentageValue,
            startDate: startDate,
            endDate: endDate,
        };

        if ((typeOfDiscount === "Cash discount" && Number(cashValue) > 0) || ((typeOfDiscount === "Percentage discount" && percentageValue))) {
            this.doAddNewPriceBook(component, newPriceBook);
        } else {
            this.doShowToast(component, "Fill required fields", "Warning", "Warning");
        }
    },

    doAddNewPriceBook: function (component, newPriceBook) {
        let doAddNewPriceBookAction = component.get("c.addNewPriceBook");
        doAddNewPriceBookAction.setParams({
            newDiscount: JSON.stringify(newPriceBook)
        });
        doAddNewPriceBookAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let addEvent = $A.get("e.c:TCR_AddNewPriceBookEvent");
                addEvent.fire();
                component.set("v.selectedTypeDiscount", 'None');
                component.set("v.productCategory", false);
                component.set("v.selectedAllCategory", false);
                component.set("v.percentageDiscount", false);
                component.set("v.cashDiscount", false);
                component.set("v.priceBookName", '');
                component.set("v.cashValue", 0);
                component.set("v.percentageValue", 0);
                component.set("v.startDate", '');
                component.set("v.endDate", '');
                this.switchSpinner(component, false);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(doAddNewPriceBookAction);
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