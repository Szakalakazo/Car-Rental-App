({
    doInit: function (component, event, helper) {
        helper.initPoster(component, event, helper);
    },

    doGoToRecordPage: function (component, event, helper) {
        console.log('ide');
        let recordId = component.get("v.itemProductId");
        let sitePrefix = $A.get("$Site.siteUrlPrefix");
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": sitePrefix + "/product/" + recordId
        });
        urlEvent.fire();
    },
})