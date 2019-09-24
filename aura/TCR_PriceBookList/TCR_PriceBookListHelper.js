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
                console.log("Price Book Products Do Init Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
        this.switchSpinner(component, true);
    },

    switchSpinner: function (component, status) {
        const spinnerComponent = component.find('spinner');
        if (spinnerComponent) {
            spinnerComponent.switchSpinner(status);
        } else {
            console.error("'spinner' does not exist");
        }
    },
})