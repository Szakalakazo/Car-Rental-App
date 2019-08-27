({
    getAllCases: function(component, event, helper) {
        let id = component.get("v.recordId.ContactId");
        let action = component.get("c.getCasesByContract");
        action.setParams({
            'selectedCaseId' : component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            if (response.getState() === "SUCCESS") {
                component.set("v.listOfCases", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})