({
    passID : function(component, event, helper) {

        let cmpEvent1 = $A.get("e.c:TCR_E_PassDivision"); // todo zmienic zeby uzywaly jednego eventu
        let cmpEvent2 = $A.get("e.c:TCR_E_PassDivisions");
        let itemId = component.get("v.item")["Id"];
        let item = component.get("v.item");
        let divisions = [];
        divisions.push(item);

        cmpEvent1.setParams({
            "divisionID": itemId,
            "divisionObject" : item
        });

        cmpEvent2.setParams({
            "divisionLocations": divisions,
            "zoomLevel" : "12"
        });
        cmpEvent1.fire();
        cmpEvent2.fire();
    }
})