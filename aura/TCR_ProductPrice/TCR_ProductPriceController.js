({
    init: function (component, event, helper) {
        helper.doInit(component, event, helper);
        helper.initAverageRating(component, event, helper);
    },

    getRating: function (component, event, helper) {
        console.log('catching');
        helper.initAverageRating(component, event, helper);
    },

    clickButtonDown: function (component, event, helper) {
        let amount = component.get("v.amountProduct");
        if (amount > 1) {
            helper.doButtonAmount(component, -1);
        }
    },

    clickButtonUp: function (component, event, helper) {
        let amount = component.get("v.amountProduct");
        if (amount < 100) {
            helper.doButtonAmount(component, 1);
        }
    },

    clickAddToBasket: function (component, event, helper) {
        helper.doAddToBasket(component);
    },
})