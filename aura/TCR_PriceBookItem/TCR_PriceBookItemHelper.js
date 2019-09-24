({
    fireEvent: function(component, event, handler) {
        let recordId = component.get('v.recordId');
        console.log('recordId ' + recordId);

        let appEvent = $A.get("e.c:TCR_ShowPriceBookDetails");
        appEvent.setParams({"priceBookId": recordId});
        appEvent.fire();
    },

    deletePriceBook: function(component, event, handler) {
        let recordId = component.get('v.recordId');
        let action = component.get("c.deletePriceBook");
        action.setParam("priceBookId",recordId);
        $A.enqueueAction(action);
    },
})