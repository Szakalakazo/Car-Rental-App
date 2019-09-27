({
    loadImages: function (component, event, helper) {
        let action = component.get("c.getProductImage");
        action.setParams({
            'recordId': component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.poster", response.getReturnValue().poster);
                component.set("v.listOfImages", response.getReturnValue().images);
            } else {
                component.find("toast").showToast(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(action);
    }
})