({
    fireEvent: function (component, event, handler) {
        let recordId = component.get('v.recordId');
        let appEvent = $A.get("e.c:TCR_ShowPriceBookDetails");
        appEvent.setParams({"priceBookId": recordId});
        appEvent.fire();
    },

    deletePriceBook: function (component, event, handler) {
        let recordId = component.get('v.recordId');
        let action = component.get("c.deletePriceBook");
        action.setParam("priceBookId", recordId);
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let deletePriceBookEvent = $A.get("e.c:TCR_DeletePriceBookEvent");
                deletePriceBookEvent.fire();
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(action);
    },
})