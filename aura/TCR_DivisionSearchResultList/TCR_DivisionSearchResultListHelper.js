({
    searchDivision: function(component, event) {
        let searchedDivision = event.getParam("searchedDivision");
        let action = component.get("c.getDivisions");
        action.setParams({
            'searchedDivision': searchedDivision
        });

        let self = this;
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.listOfDivisions", response.getReturnValue());
                self.fireDivisionLocationEvent(component, event);
                component.set("v.showSpinner", false);

            } else {
                let errors = response.getError();
                console.error(errors[0].message);
            }
        });
        $A.enqueueAction(action);
    },

    clearSearchForm: function(component, event) {
        let searchedDivision = event.getParam("clearSearchFormEvent");
        let action = component.get("c.getDivisions");
        action.setParams({
            'searchedDivision': ""
        });

        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set("listOfDivisions", response.getReturnValue());
            } else {
                let errors = response.getError();
                console.error(errors[0].message);
            }
        });
        $A.enqueueAction(action);
    },

    fireDivisionLocationEvent: function(component, event) {
        let cmpEvent = $A.get("e.c:TCR_E_PassDivisions");

        let listOfDivisions = component.get("v.listOfDivisions");
        let isSearchCompleted = false;
        if(listOfDivisions.length > 0) {
            isSearchCompleted = true;
        }
        cmpEvent.setParams({
            "divisionLocations": listOfDivisions,
            "isSearchCompleted": isSearchCompleted
        });
        cmpEvent.fire();
    }
})