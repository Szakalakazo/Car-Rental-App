({
    init: function(component, event, helper) {
        let idsJson = sessionStorage.getItem('customSearch--recordIds');
        if (!$A.util.isUndefinedOrNull(idsJson)) {
            let listOfWrappers = JSON.parse(idsJson);
            component.set('v.listOfWrappers', listOfWrappers);
            sessionStorage.removeItem('customSearch--recordIds');
        }
    }
})