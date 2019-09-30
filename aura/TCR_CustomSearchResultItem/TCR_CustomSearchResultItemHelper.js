({
    initPoster: function (component, event, helper) {
        let recordId = component.get("v.record").product.Id;
        let action = component.get("c.getProductPoster");
        action.setParams({
            'recordId': recordId
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.poster", response.getReturnValue());
            } else {
                component.find("toast").showToast(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(action);
    },

    initAverageRating: function (component) {
        let getAverageRating = component.get("c.getAverageRating");
        getAverageRating.setParam("productId", component.get("v.record").product.Id);
        getAverageRating.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.rating", response.getReturnValue());
            } else {
                component.find("toast").showToast(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(getAverageRating);
    },
})