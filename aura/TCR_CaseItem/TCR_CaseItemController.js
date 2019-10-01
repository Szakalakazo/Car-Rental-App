({
    navigateToCase: function(component, event, helper) {
        let navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
              "recordId": component.get("v.item.Id"),
              "slideDevName": "related"
            });
            navEvt.fire();
    }
})