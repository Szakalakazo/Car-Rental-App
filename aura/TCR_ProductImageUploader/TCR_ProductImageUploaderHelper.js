({
    initImages : function(component, event,helper) {
        console.log('init');

        let action = component.get("c.getProductImage");
        action.setParams({
            'recordId' : component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            if (response.getState() === "SUCCESS") {
                console.log('SUCCESS -----> ' + response.getReturnValue());
                let listPath = response.getReturnValue();
                component.set("v.listOfImages", listPath.images);
                component.set("v.posterPath", listPath.poster);
                console.log('v.listOfImages -----> ' + component.get("v.listOfImages"));
                console.log('v.posterPath -----> ' + component.get("v.posterPath"));

            } else {
                console.log('FAILURE  -----> ');
                component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(action);
    },
})