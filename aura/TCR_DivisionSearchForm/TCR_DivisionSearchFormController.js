({
    fireSearchItemEvent: function(component, event, helper) {
        let cmpEvent = component.getEvent("searchDivisionEvent");
        let searchedDivision = component.get("v.searchedDivision");
        component.set("v.isAnyFieldFilled" , false);

        if ((searchedDivision.Name != null && searchedDivision.Name.length !== 0) ||
            (searchedDivision.BillingCity != null && searchedDivision.BillingCity.length !== 0) ||
            (searchedDivision.BillingPostalCode != null && searchedDivision.BillingPostalCode.length !== 0) ||
            (searchedDivision.BillingCountry != null && searchedDivision.BillingCountry.length !== 0)) {
            cmpEvent.setParams({
                "searchedDivision": JSON.stringify(searchedDivision)
            });
            cmpEvent.fire();
        } else {
            component.set("v.isAnyFieldFilled" , true);
        }
    },

    fireClearResultListEvent: function(component, event, helper) {
        var cmpEvent = $A.get("e.c:TCR_E_Clear");
        component.set("v.searchedDivision", {});
        component.set("v.isAnyFieldFilled", false);
        cmpEvent.setParams({
            "searchedDivision": JSON.stringify(component.get("v.searchedDivision"))
        });
        cmpEvent.fire();
    }
})