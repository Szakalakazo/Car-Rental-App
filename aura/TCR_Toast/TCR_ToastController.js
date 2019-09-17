({
    showToast : function(component, event, helper) {
        let params = event.getParam( 'arguments' );
        component.find('notifLib').showToast({
            "variant": params.messageType,
            "message": params.message,
            "mode": "dismissable"
        });
    },
})