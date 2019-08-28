({
    getAllImages: function(component, event, helper) {
        let action = component.get("c.getProductImages");
        action.setParams({
            'productIdInApex' : component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            if (response.getState() === "SUCCESS") {
                component.set("v.listOfImageUrls", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})