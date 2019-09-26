({
    navigateToProduct: function(component, event, helper) {
        let selectedItem = event.currentTarget;
        let index = selectedItem.dataset.index;
        let order = component.get("v.order");
        let recordId = order.OrderItems[index].Product2Id;
        let prefixSite = $A.get("$Site.siteUrlPrefix");
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": prefixSite + "/detail/" + recordId
        });
        urlEvent.fire();
    },
})