({
    doInit: function (component) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCartJSON = sessionStorage.getItem('user-cart' + userId);
        if (!$A.util.isUndefinedOrNull(sessionUserCartJSON)) {
            component.set("v.itemList", JSON.parse(sessionUserCartJSON));
        } else {
            component.set("v.isCartEmpty", true);
            component.set("v.itemList", []);
        }
    },

    doRemoveFromCart: function (component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCart = JSON.parse(sessionStorage.getItem('user-cart' + userId));
        let index = event.currentTarget.dataset.index;
        sessionUserCart.splice(index, 1);
        sessionStorage.setItem('user-cart' + userId, JSON.stringify(sessionUserCart));
        let removeItemFromBasketEvent = $A.get("e.c:TCR_AddProductToBasket");
        removeItemFromBasketEvent.setParam('amountOfProduct', sessionUserCart.length);
        removeItemFromBasketEvent.fire();
        this.doInit(component);
    },

    doGoToRecordPage: function (component, event, helper) {
        let recordId = event.currentTarget.dataset.record;
        let sitePrefix = $A.get("$Site.siteUrlPrefix");
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": sitePrefix + "/product/" + recordId
        });
        urlEvent.fire();
    },

    initTotalPrice: function (component) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCartJSON = sessionStorage.getItem("user-cart" + userId);
        if (!$A.util.isUndefinedOrNull(sessionUserCartJSON)) {
            let sessionUserCart = JSON.parse(sessionUserCartJSON);
            let totalPrice = 0;
            for (let i in sessionUserCart) {
                totalPrice += sessionUserCart[i].price * sessionUserCart[i].quantity;
            }
            component.set("v.totalPrice", totalPrice);
        }
    },
})