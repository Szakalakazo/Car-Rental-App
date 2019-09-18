({
    doInit: function(component, event, helper) {
        helper.initPoster(component, event,helper);
    },

    navigateToRecord: function(component, event, helper) {
        let prefixSite = $A.get("$Site.siteUrlPrefix");
        let recordId = component.get("v.resultItem").product.Id;
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": prefixSite + "/detail/" + recordId
        });
        urlEvent.fire();
    },

    addToBasket: function(component, event, helper) {
        let objectItem = component.get("v.resultItem");
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let cartJson = sessionStorage.getItem('cart'+userId);
        if (!$A.util.isUndefinedOrNull(cartJson)) {
            console.log('add to list');
            let basketList = JSON.parse(cartJson);
            basketList.push(objectItem);
            console.log(basketList);
            sessionStorage.setItem('cart'+userId, JSON.stringify(basketList));
            component.find("toastCmp").showToastModel($A.get("{!$Label.c.BRC_Product_Added_to_Cart}"), "info");
        } else {
            console.log('new list');
            let basketList = [objectItem];
            console.log(basketList);
            sessionStorage.setItem('cart'+userId, JSON.stringify(basketList));
            component.find("toastCmp").showToastModel($A.get("{!$Label.c.BRC_Product_Added_to_Cart}"), "info");
        }
    },
})