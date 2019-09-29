({
    onInit: function (component, event, helper) {
        let getReviewsAction = component.get("c.getProductReviews");
        getReviewsAction.setParam("productId", component.get("v.recordId"));
        getReviewsAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.switchSpinner(component, false);
                component.set("v.reviews", response.getReturnValue());
            } else {
                component.set("v.reviews", Array());
            }
        });
        $A.enqueueAction(getReviewsAction);
        this.switchSpinner(component, true);
    },

    doOpenModal: function (component) {
        component.find("service").getNewRecord(
            "Product_Review__c", null, false,
            $A.getCallback(function () {
                let rec = component.get("v.productReviewRecord");
                let error = component.get("v.recordError");
                if (error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                } else {
                }
            })
        );
        component.set("v.IsOpenAddReviewModal", true);
    },

    doCloseModal: function (component) {
        component.set("v.IsOpenAddReviewModal", false);
    },

    doSubmitReview: function (component, event, helper) {
        let productIdToSet = component.get("v.recordId");
        let productNameToSet = component.get("v.product.title");
        component.set("v.productReview.Product_Id__c", productIdToSet.toString());
        component.set("v.movieReview.Product_Name__c", productNameToSet);
        component.find("service").saveRecord(function (saveResult) {
            if (saveResult.state === "SUCCESS") {
                let reviewAddedEvent = $A.get("e.c:TCR_ProductReviewAddedEvent");
                reviewAddedEvent.fire();
                console.log('fired');
                let resultsToast = $A.get("e.force:showToast");
                resultsToast.setParams({
                    "title": "Saved",
                    'type': 'success',
                    "message": "Review Saved successfully."
                });
                resultsToast.fire();
                let reInitializePageReviews = component.get('c.doInit');
                $A.enqueueAction(reInitializePageReviews);
            }
        });

        this.doCloseModal(component);
        component.find("service").getNewRecord(
            "Product_Review__c", null, false,
            $A.getCallback(function () {
                let rec = component.get("v.productReviewRecord");
                let error = component.get("v.recordError");
                if (error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                }
            })
        );
    },

    switchSpinner: function (component, status) {
        const spinnerComponent = component.find('spinner');
        if (spinnerComponent) {
            spinnerComponent.switchSpinner(status);
        } else {
            console.error("'spinner' does not exist");
        }
    }
})