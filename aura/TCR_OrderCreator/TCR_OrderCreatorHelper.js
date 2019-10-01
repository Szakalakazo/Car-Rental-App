({
    doInit: function (component) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCartJSON = sessionStorage.getItem('user-cart' + userId);
        if (!$A.util.isUndefinedOrNull(sessionUserCartJSON)) {
            let sessionUserCart = JSON.parse(sessionUserCartJSON);
            component.set('v.cartItemAmount', sessionUserCart.length);
        }
    },

    doInitAddress: function (component) {
        let action = component.get("c.getCommunityUserAddress");
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                let user = response.getReturnValue();
                component.set("v.order.ShippingStreet", user.Address.street);
                component.set("v.order.ShippingPostalCode", user.Address.postalCode);
                component.set("v.order.ShippingCity", user.Address.city);
                component.set("v.order.ShippingState", user.Address.state);
                component.set("v.order.ShippingCountry", user.Address.country);
            } else {
                component.find("toastCmp").doShowToast(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(action);
    },

    createAnOrder: function (component, event, helper) {
        let orderShippingDetails = component.get('v.order');
        let sessionUserCartJSON = JSON.stringify(component.get("v.itemList"));
        let action = component.get("c.createOrder");
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
    },

    doShowToast: function (component, message, title, typeToast) {
        const toastComponent = component.find('toast');
        if (toastComponent) {
            toastComponent.showToast(message, title, typeToast);
        } else {
            console.error("'Toast Component' does not exist");
        }
    }
})