({
    handleSearchComponentEvent: function(component, event, helper) {
        component.set("v.showSpinner", true);
        var buttonClicked = event.getSource().getLocalId();
        var message = event.getParam("searchedDivision");
        helper.searchDivision(component, event);
    },

    handleClearSearchResultsEvent: function(component, event, helper) {
        let divisions = event.getParam("searchedDivision");
        component.set("v.listOfDivisions", null);
    }
})