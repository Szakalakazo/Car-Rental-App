({
    initPoster: function (component, event, helper) {
        let recordId = component.get("v.order.Product2Id");
        let action = component.get("c.getProductPoster");
        action.setParams({
            'recordId': recordId
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.poster", response.getReturnValue());
            } else {
                component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(action);
    },
})