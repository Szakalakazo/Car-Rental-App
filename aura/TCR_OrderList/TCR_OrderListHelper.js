({
    initList: function(component, event, helper) {
        let action = component.get("c.getOrderList");
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                let ordersList = response.getReturnValue();
                component.set("v.ordersList", ordersList);
                console.log(JSON.stringify(ordersList));
            } else {
                component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(action);
    },
})