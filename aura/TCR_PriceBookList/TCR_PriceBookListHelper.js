({
    doInit: function (component) {
        let action = component.get("c.getPriceBookList");
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.recordList", response.getReturnValue());
                this.switchSpinner(component, false);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(action);
        this.switchSpinner(component, true);
    },

    doDeletePriceBook: function (component) {
        let recordId = component.get('v.recordId');
        let action = component.get("c.deletePriceBook");
        action.setParam("priceBookId", recordId);
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let deletePriceBookEvent = $A.get("e.c:TCR_DeletePriceBookEvent");
                deletePriceBookEvent.fire();
                console.log('delete fired');
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error', 'Error');
            }
        });
        $A.enqueueAction(action);
    },

    switchSpinner: function (component, status) {
        const spinnerComponent = component.find('spinner');
        if (spinnerComponent) {
            spinnerComponent.switchSpinner(status);
        } else {
            console.error("'spinner' does not exist");
        }
    },

    fireEvent: function (component, event, handler) {
        let recordId = component.get('v.recordId');
        let appEvent = $A.get("e.c:TCR_ShowPriceBookDetails");
        appEvent.setParams({"priceBookId": recordId});
        appEvent.fire();
        console.log('fire');
    },
})