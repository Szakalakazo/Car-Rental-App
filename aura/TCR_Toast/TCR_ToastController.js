({
    showToast: function(component, event, helper) {
        let params = event.getParam('arguments');
        component.find('notifLib').showToast({
            "variant": params.messageType,
            "message": params.message,
            "mode": "dismissable"
        });
/*
        let messageType = "";
        let messageTitle = "";
        let message = "";
        component.set("v.message", params.message);
        component.set("v.messageType", params.messageType);*/

       /* let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": messageType,
            "title": messageTitle,
            "message": message
        });
        toastEvent.fire();*/
    }
})