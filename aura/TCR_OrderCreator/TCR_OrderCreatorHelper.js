({
    doInit: function (component) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCartJSON = sessionStorage.getItem('user-cart' + userId);
        if (!$A.util.isUndefinedOrNull(sessionUserCartJSON)) {
            let sessionUserCart = JSON.parse(sessionUserCartJSON);
            component.set('v.cartItemAmount', sessionUserCart.length);
        }
    },

    createAnOrder: function (component, event, helper) {
        let orderShippingDetails = component.get('v.order');
        let sessionUserCartJSON = JSON.stringify(component.get("v.itemList"));
        let action = component.get("c.createOrder");
        console.log(JSON.stringify(orderShippingDetails));
        action.setParams({
            'jsonString': sessionUserCartJSON,
            "orderDetails": orderShippingDetails
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.find("toastCmp").showToastModel('SUCCESS', "info");
            } else {
                component.find("toastCmp").showToastModel('response.getError()[0].message', "error");
            }
        });
        $A.enqueueAction(action);
        this.cleanUserShoppingList(component);
    },

    cleanUserShoppingList: function (component) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        sessionStorage.removeItem('user-cart' + userId);
        let compEvent = $A.get("e.c:TCR_FinalizeOrder");
        compEvent.setParam('amountOfProduct', 0);
        compEvent.fire();
        console.log('fired');
    },
})