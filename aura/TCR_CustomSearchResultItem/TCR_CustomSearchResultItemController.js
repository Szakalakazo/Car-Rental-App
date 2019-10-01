({
    doInit: function (component, event, helper) {
        helper.initPoster(component, event, helper);
        helper.initAverageRating(component, event, helper);
        $A.enqueueAction(component.get('c.setDiscount'));
    },

    goToRecordPage: function (component, event, helper) {
        let sitePrefix = $A.get("$Site.siteUrlPrefix");
        let recordId = component.get("v.record").product.Id;
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": sitePrefix + "/product/" + recordId
        });
        urlEvent.fire();
    },

    setDiscount: function (component, event, helper) {
        let priceList = component.get("v.record.price");
        console.log('priceList  ' + JSON.stringify(priceList));

        let discount = priceList[priceList.length - 1].Discount_Price__c;
        console.log('discount  ' + discount);
        component.set('v.discount', discount);
    },
})