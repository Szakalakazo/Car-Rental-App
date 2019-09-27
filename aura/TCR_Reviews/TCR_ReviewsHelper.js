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

/*        let action = component.get("c.getCurrentUserProfile");
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let storeResponse = response.getReturnValue();
                component.set("v.isAdminOptionsVisible", storeResponse);
            }
        });
        $A.enqueueAction(action);*/

        component.find("service").getNewRecord(
            "Product_Review__c", // objectApiName
            null, // recordTypeId
            false, // skip cache?
            $A.getCallback(function () {
                let rec = component.get("v.productReviewRecord");
                let error = component.get("v.recordError");
                if (error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                } else {
                }
            })
        );

    },

    doOpenModal: function (component) {
        component.find("service").getNewRecord(
            "Product_Review__c", // objectApiName
            null, // recordTypeId
            false, // skip cache?
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

    doAddMyRatingToMovie: function (component, event, idProduct) {
        let addRatingAction = component.get("c.insertProductVote");
        let rating = component.get("v.productReview.Rating__c");
        addRatingAction.setParam("idProduct", idProduct);
        addRatingAction.setParam("oneVote", rating);
        addRatingAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.switchSpinner(component, false);
            } else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(addRatingAction);
        this.switchSpinner(component, true);
    },

    // to jest to z dziwna metoda
    doSubmitReview: function (component, event, helper) {
        let productIdToSet = component.get("v.recordId");
        let productNameToSet = component.get("v.product.title");
        component.set("v.productReview.Product_Id__c", productIdToSet.toString());
        component.set("v.movieReview.Product_Name__c", productNameToSet); //name?
        component.find("service").saveRecord(function (saveResult) {
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                let reviewAddedEvent = $A.get("e.c:TCR_ProductReviewAddedEvent");
                reviewAddedEvent.fire();
                let resultsToast = $A.get("e.force:showToast");
                if ($A.util.isUndefined(resultsToast)) {
                    alert('Review Saved successfully.');
                } else {
                    resultsToast.setParams({
                        "title": "Saved",
                        'type': 'success',
                        "message": "Review Saved successfully."
                    });
                    resultsToast.fire();
                }

                let getReviewsAction = component.get("c.getProductReviews");
                getReviewsAction.setParam("productId", component.get("v.recordId"));
                getReviewsAction.setCallback(this, function (response) {
                    let state = response.getState();
                    if (state === "SUCCESS") {
                        component.set("v.reviews", response.getReturnValue());
                    } else {
                        component.set("v.reviews", Array());
                    }
                });
                $A.enqueueAction(getReviewsAction);
            } else if (saveResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                console.log('Problem saving BoatReview, error: ' +
                    JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state +
                    ', error: ' + JSON.stringify(saveResult.error));
            }
        });

        this.doCloseModal(component);
        component.find("service").getNewRecord(
            "Product_Review__c", // objectApiName
            null, // recordTypeId
            false, // skip cache?
            $A.getCallback(function () {
                let rec = component.get("v.productReviewRecord");
                let error = component.get("v.recordError");
                if (error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                } else {
                }
            })
        );
    },

    doEditReview: function (component, event) {
        let commId = event.getSource().get("v.value");
        component.set("v.IsOpenEditReviewModal", true);
        let allReviews = component.get("v.reviews");
        allReviews.forEach(function (acc) {
            if (acc.Id == commId) {
                component.set("v.productReviewRecord", acc);
                component.set("v.productReview", acc);
            }
        })
    },

    doRefreshAfterToastInfo: function (component, event) {
        let getReviewsAction = component.get("c.getProductReviews");
        getReviewsAction.setParam("productId", component.get("v.product.id"));
        getReviewsAction.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.reviews", response.getReturnValue());
            } else {
                component.set("v.reviews", Array());
            }
        });
        $A.enqueueAction(getReviewsAction);
    },

    doDeleteReview: function (component, event) {
        let commId = event.getSource().get("v.value");
        component.set("v.recordId", commId);
        component.set("v.isOpenDeleteModal", true);
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