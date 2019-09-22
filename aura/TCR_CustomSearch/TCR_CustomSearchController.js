({
    doInit: function (component, event, helper) {
        helper.doInit(component, event, helper);
    },

    handleClick: function (component, event, helper) {
        helper.search(component, event, helper);
    },

    handleKeyUp: function (component, event, helper) {
        if (event.getParams().keyCode == 13) {
            helper.search(component, event, helper);
        }
    },

    handleOpenCartModal: function (component, event, helper) {
        component.set("v.isCartModalOpen", true);
    },

    handleCloseModal: function (component, event, helper) {
        component.set("v.isCartModalOpen", false);
    },

    goToBasket: function (component, event, helper) {
        let sitePrefix = $A.get("$Site.siteUrlPrefix");
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": sitePrefix + "/cart/"
        });
        urlEvent.fire();
    },

    refreshItemsAmount: function (component, event, helper) {
        let numberOfItems = event.getParam("amountOfProduct");
        component.set('v.cartItemAmount', numberOfItems);
    },
})