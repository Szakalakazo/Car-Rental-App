({
    doInit: function(component, event, helper) {
        helper.initPoster(component, event,helper);
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
})