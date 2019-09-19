({
    init: function (component, event, helper) {
        let idsJson = sessionStorage.getItem('customSearch--recordIds');
        let searchText = sessionStorage.getItem('customSearch--searchText');

        if (!$A.util.isUndefinedOrNull(idsJson)) {
            let listOfWrappers = JSON.parse(idsJson);
            component.set('v.allResults', listOfWrappers);
        }
        let action = component.get('c.getBrands');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                component.set("v.brands", response.getReturnValue());
                let resultsToDisplay = component.get('v.allResults');
                component.set('v.filteredResults', resultsToDisplay);
            }
        });
        $A.enqueueAction(action);
    },

    filterResults: function (component, event, helper) {
        let allResults = component.get("v.allResults");
        let minPrice = component.get("v.minPrice");
        let maxPrice = component.get("v.maxPrice");
        let productionYear = component.get("v.productionYear");
        let brand = component.find('brandSelect').get('v.value');
        let doors = component.find('doorsSelect').get('v.value');

        let filterResults = allResults.filter(x => {
            if (minPrice !== '' && minPrice !== null) {
                if (x.price[0].UnitPrice < minPrice)
                    return false;
            }
            if (maxPrice !== '' && maxPrice !== null) {
                if (x.price[0].UnitPrice > maxPrice)
                    return false;
            }
            if (doors !== '' && doors !== null) {
                if (x.product.Doors_Number__c != doors)
                    return false;
            }
            if (productionYear !== '' && productionYear !== null) {
                if (x.product.Production_Year__c < productionYear)
                    return false;
            }
            if (brand !== '' && brand !== null) {
                if (x.product.Brand__c !== brand)
                    return false;
            }
            return true;
        });
        component.set('v.filteredResults', filterResults);
    },

    applySorting: function (component, event, helper) {
        let records = component.get('v.filteredResults');
        if (records) {
            let option = component.find('option').get('v.value');
            switch (option) {
                case '1':
                    records.sort((x, y) => {
                        if (x.product.Name.toLowerCase() > y.product.Name.toLowerCase()) {
                            return 1;
                        }
                        if (x.product.Name.toLowerCase() < y.product.Name.toLowerCase()) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                case '2':
                    records.sort((x, y) => {
                        if (x.product.Name.toLowerCase() < y.product.Name.toLowerCase()) {
                            return 1;
                        }
                        if (x.product.Name.toLowerCase() > y.product.Name.toLowerCase()) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                case '3':
                    records.sort((x, y) => {
                        if (x.price[0].UnitPrice > y.price[0].UnitPrice) {
                            return 1;
                        }
                        if (x.price[0].UnitPrice < y.price[0].UnitPrice) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                case '4':
                    records.sort((x, y) => {
                        if (x.price[0].UnitPrice < y.price[0].UnitPrice) {
                            return 1;
                        }
                        if (x.price[0].UnitPrice > y.price[0].UnitPrice) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
            }
            component.set('v.filteredResults', records);
        }
    }
})