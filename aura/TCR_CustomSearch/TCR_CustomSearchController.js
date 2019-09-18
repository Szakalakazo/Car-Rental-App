({
    handleClick: function (component, event, helper) {
        helper.search(component, event, helper);
    },

    handleKeyUp: function (component, event, helper) {
        if (event.getParams().keyCode == 13) {
            helper.search(component, event, helper);
        }
    },
})