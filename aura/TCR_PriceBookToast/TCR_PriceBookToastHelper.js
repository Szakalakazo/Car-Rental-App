({
    doShowToast : function(component, event) {
        let toastEvent = $A.get("e.force:showToast");
        let params = event.getParam("arguments");
        let message = params.message;
        let title = params.title;
        let typeToast = params.typeToast;
        if (message && typeToast && title) {
            toastEvent.setParams({
                title : title,
                message: message,
                duration:'8000',
                type: typeToast,
            });
            toastEvent.fire();
        }
    }
})