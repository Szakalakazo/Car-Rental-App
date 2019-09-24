({
    doInit: function(component) {
        let recordList = component.get("v.recordList");
        let action = component.get("c.getPriceBookList");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.recordList", response.getReturnValue());
                console.log('doInit success');
                console.log('productList', response.getReturnValue());
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
                console.log("Price Book Products Do Init Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },
})