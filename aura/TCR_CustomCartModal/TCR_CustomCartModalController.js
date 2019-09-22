({
    doInit: function (component, event, helper) {
        helper.initList(component, event, helper);
        helper.initTotalPrice(component, event,helper);
    },

    navigateToProduct: function (component, event, helper) {
        helper.goToRecordPage(component, event, helper);
    },

    goToCartPage: function (component, event, helper) {
        let navEvt = $A.get("e.force:navigateToURL");
        navEvt.setParams({url: "/cart-page"});
        navEvt.fire();
    },
})