({
    initPoster: function (component, event, helper) {
        console.log('inif poster 1');
        let recordId = component.get("v.order.Product2Id");
        console.log('----> ORDER' +JSON.stringify( component.get("v.order")));
        console.log('----> ORDER Product ' + recordId);


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