({
    fireSearchItemEvent: function(component, event, helper) {

        var cmpEvent = component.getEvent("searchDivisionEvent");
        cmpEvent.setParams({
            "searchedDivision": JSON.stringify(component.get("v.searchedDivision"))
        });
        cmpEvent.fire();


        /*
        let zmienna = component.find('divisionForm');
        console.log('-----> ' + zmienna);

        var allValid = zmienna.reduce(function(accumulator, currentValue, currentIndex, array) {
            console.log('-----> ' + ((accumulator + currentValue) !== 0));
            return ((accumulator + currentValue) !== 0);
        }, true);
        if (allValid) {
            var cmpEvent = component.getEvent("searchDivisionEvent");
            cmpEvent.setParams({
                "searchedDivision": JSON.stringify(component.get("v.searchedDivision"))
            });
            cmpEvent.fire();
        }
        */
    },

    fireClearResultListEvent: function(component, event, helper) {
        var cmpEvent = $A.get("e.c:TCR_E_Clear");
        var name = component.find("divisionForm");
        component.set("v.searchedDivision", {});
        cmpEvent.setParams({
            "searchedDivision": JSON.stringify(component.get("v.searchedDivision"))
        });
        cmpEvent.fire();
    }
})