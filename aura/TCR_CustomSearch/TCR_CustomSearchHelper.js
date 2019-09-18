({
    search : function(component, event, helper) {
        let searchText = component.get('v.searchText');
        let action = component.get('c.searchForIds');
        action.setParams({searchText: searchText});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let records = response.getReturnValue();
                sessionStorage.setItem('customSearch--recordIds', JSON.stringify(records));
                sessionStorage.setItem('customSearch--searchText', searchText);
                let navEvt = $A.get('e.force:navigateToURL');
                navEvt.setParams({url: '/search-results'});
                navEvt.fire();
            }
        });
        $A.enqueueAction(action);
    }
})