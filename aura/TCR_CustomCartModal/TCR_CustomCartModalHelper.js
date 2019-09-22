({
    initList: function (component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCartJSON = sessionStorage.getItem("user-cart" + userId);
        if (!$A.util.isUndefinedOrNull(sessionUserCartJSON)) {
            let userShoppingList = JSON.parse(sessionUserCartJSON);
            component.set("v.listOfProducts", userShoppingList);
            if (userShoppingList.length === 0) {
                component.set("v.isCartEmpty", true);
            } else {
                component.set("v.isCartEmpty", false);
            }
        } else {
            component.set("v.isCartEmpty", true);
        }
    },

    initTotalPrice: function (component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCartJSON = sessionStorage.getItem("user-cart" + userId);
        if (!$A.util.isUndefinedOrNull(sessionUserCartJSON)) {
            let sessionUserCart = JSON.parse(sessionUserCartJSON);
            let totalPrice = 0;
            for (let i in sessionUserCart) {
                totalPrice += sessionUserCart[i].price * sessionUserCart[i].quantity;
            }
            component.set("v.totalPrice", totalPrice);
        } else {
            component.set("v.totalPrice", '0');
        }
    },

    goToRecordPage: function (component, event, helper) {
        let recordId = event.currentTarget.dataset.index;
        let sitePrefix = $A.get("$Site.siteUrlPrefix");
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": sitePrefix + "/product/" + recordId
        });
        urlEvent.fire();
    },
})