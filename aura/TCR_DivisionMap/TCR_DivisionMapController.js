({
    getMap: function(component, event, helper) {
        let divisions = event.getParam("divisionLocations");
        let isSearchCompleted = event.getParam("isSearchCompleted");

        let divisionsMapLocation = divisions.map(function(division) {
            let item = {
                location: {
                    Street: division.BillingStreet,
                    City: division.BillingCity,
                    Country: division.BillingCountry
                },
                title: division.Name,
                icon: 'standard:account'
            }
            return item;
        });
        component.set("v.mapMarkers", divisionsMapLocation);
        component.set("v.listView", "hidden");
    },

    clearMap: function(component, event, helper) {
        component.set("v.mapMarkers", {});
    }
})