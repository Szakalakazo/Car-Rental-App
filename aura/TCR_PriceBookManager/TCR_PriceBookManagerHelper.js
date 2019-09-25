({
    doGetAllProducts: function (component, event) {
        let action = component.get("c.getAllProducts");
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let allProducts = JSON.parse(response.getReturnValue());
                component.set("v.productEntryWrapperList", allProducts);
                component.set("v.productEntryWrapperListToDisplayInSearch", allProducts);
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

    doSelectDiscountType: function (component, event) {
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
            component.set("v.customCategory", false);
        } else {
            console.error("Component selectedTypeDiscount not exist");
        }
    },

    doSelectProductType: function (component, event) {
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
        let startDate = component.get("v.startDate");
        let endDate = component.get("v.endDate");
        let name = component.get("v.priceBookName");
        if (name === undefined && name === '') {
            console.log('doShowToast ');
            this.doShowToast(component, "Fill required fields", "Warning", "Warning");
        }

        let newPriceBook = this.doCreateNewProductWrapper(component, event);
        let typeOfDiscount = component.find("selectedTypeDiscount").get("v.value");
        let cashValue = component.get("v.cashValue");
        let percentageValue = component.get("v.percentageValue");

        if ((typeOfDiscount === "Cash discount" && Number(cashValue) > 0) || ((typeOfDiscount === "Percentage discount" && percentageValue))) {
            this.doAddNewPriceBook(component, newPriceBook);
        } else {
            this.doShowToast(component, "Fill required fields", "Warning", "Warning");
        }
    },

    doCreateNewProductWrapper: function (component, event) {
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
        return JSON.stringify(newPriceBook);
    },

    doAddNewPriceBook: function (component, newPriceBook) {
        let doAddNewPriceBookAction = component.get("c.addNewPriceBook");
        let newlyInsertedPriceBook;
        doAddNewPriceBookAction.setParams({
            newPriceBook: newPriceBook
        });
        doAddNewPriceBookAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.doCleanFieldsAfterSuccessfulInsert(component);
                this.switchSpinner(component, false);
            } else {
                this.switchSpinner(component, false);
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(doAddNewPriceBookAction);
        this.switchSpinner(component, true);
    },

    doCleanFieldsAfterSuccessfulInsert: function (component) {
        let addEvent = $A.get("e.c:TCR_AddNewPriceBookEvent");
        addEvent.fire();
        component.set("v.selectedTypeDiscount", 'None');
        component.set("v.customCategory", false);
        component.set("v.productCategory", false);
        component.set("v.selectedAllCategory", false);
        component.set("v.percentageDiscount", false);
        component.set("v.cashDiscount", false);
        component.set("v.priceBookName", '');
        component.set("v.cashValue", 0);
        component.set("v.percentageValue", 0);
        component.set("v.startDate", '');
        component.set("v.endDate", '');
        component.set("v.isSearchModalOpen", false);
        component.set("v.searchedText", '');
    },

    doSelectProductCheckbox: function (component, event) {
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
        console.log('selectedCheckBoxes ' + component.get("v.selectedCheckBoxes"));
    },

    doAddSelectedProductsToNewPriceBook: function (component) {
        let newPriceBook = this.doCreateNewProductWrapper(component);
        let selectedProductIds = component.get("v.selectedCheckBoxes");
        let action = component.get("c.addNewPriceBookWithListOfProducts");
        action.setParams({
            "newPriceBook": newPriceBook,
            "selectedProductIds": selectedProductIds
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.doCleanFieldsAfterSuccessfulInsert(component);
                this.switchSpinner(component, false);
            } else {
                this.switchSpinner(component, false);
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(action);
        this.switchSpinner(component, true);
    },

    doSearchProduct: function (component) {
        let data = component.get("v.productEntryWrapperListToDisplayInSearch");
        let allData = component.get("v.productEntryWrapperList");
        let searchKey = component.get('v.searchedText');

        let action = component.get("c.findByName");
        action.setParams({
            "searchKey": searchKey
        });

        action.setCallback(this, function (a) {
            component.set("v.productEntryWrapperListToDisplayInSearch", JSON.parse(action.getReturnValue()));
        });
        $A.enqueueAction(action)
    },

    switchSpinner: function (component, status) {
        const spinnerComponent = component.find('spinner');
        if (spinnerComponent) {
            spinnerComponent.switchSpinner(status);
        } else {
            console.error("'spinner' does not exist");
        }
    },
    doShowToast: function(component, message, title, typeToast) {
        const toastComponent = component.find('toast');
        if (toastComponent) {
            toastComponent.showToast(message, title, typeToast);
        }
        else {
            console.error("'Toast Component' does not exist");
        }
    },
})