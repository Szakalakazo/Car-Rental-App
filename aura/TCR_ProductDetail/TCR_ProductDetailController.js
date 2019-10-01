({
    getAllImages: function(component, event, helper) {
        let action = component.get("c.getProductImages");
        action.setParams({
            'productIdInApex': component.get("v.recordId")
        });
                console.log('-----> response ' + component.get("v.recordId"));
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.listOfImageUrls", response.getReturnValue());
                console.log('-----> response ' + response.getReturnValue());

            }
        });
        $A.enqueueAction(action);
    },

    navigate: function(component, event, helper) {
        component.set("v.isModalVisible", true);
        let urlValue =  component.get("v.test");
        console.log('urlValue ' + urlValue);

        var rectarget = event.currentTarget;
        var idstr = rectarget.dataset.index;
        console.log('idstr ' + idstr);
    },

    close: function(component, event, helper) {
/*        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            modal.style.display = "none";
        };
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            };
        }*/
        component.set("v.isModalVisible", false);
    }

})