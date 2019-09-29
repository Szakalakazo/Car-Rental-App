({
    doInit: function (component, event, helper) {
        helper.onInit(component, event, helper);
    },

    getRating: function (component, event, helper) {
        helper.initAverageRating(component, event, helper);
    },

    clickOpenModal: function (component, event, helper) {
        helper.doOpenModal(component);
    },

    clickCloseModal: function (component, event, helper) {
        helper.doCloseModal(component);
    },

    clickSubmitReview: function (component, event, helper) {
        let toastEvent = $A.get('e.force:showToast');
        let nameValid = component.get("v.productReview.Name");
        let rating = component.get("v.productReview.Rating__c");

        if (nameValid) {
            if (rating > 0) {
                helper.doSubmitReview(component, event);

            } else {
                toastEvent.setParams({
                    'title': 'Error!',
                    'type': 'error',
                    'mode': 'dismissable',
                    'message': 'Please leave your rating'
                });
                toastEvent.fire();
            }
        } else {
            toastEvent.setParams({
                'title': 'Error!',
                'type': 'error',
                'mode': 'dismissable',
                'message': 'Title can not be empty'
            });
            toastEvent.fire();
        }
    },

    recordUpdated: function (component, event, helper) {
        component.find("deleteHandler").deleteRecord($A.getCallback(function (deleteResult) {
            if (deleteResult.state === "SUCCESS" || deleteResult.state === "DRAFT") {
                helper.helperMethod(component);
                alert("Record is deleted.");
            }
        }));
    },

    handleRefreshAfterToastInfo: function (component, event, helper) {
        let toastMessageParams = event.getParams();
        let message = toastMessageParams.message;
    },

    onRecordUpdated: function (component, event) {
        let changeType = event.getParams().changeType;
        if (changeType === "CHANGED") {
            component.find("service").reloadRecord();
        }
    }
})