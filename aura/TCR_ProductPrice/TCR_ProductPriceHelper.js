({
    doInit: function(component, event,helper) {
    let action = component.get("c.getProductPrice");
    action.setParams({
        'productId' : component.get("v.recordId")
    });
    action.setCallback(this, function(response){
        if (response.getState() === "SUCCESS") {
            let result = response.getReturnValue()
            component.set("v.standardPrice", result[0].UnitPrice);
            component.set("v.discountPrice", result[0].UnitPrice - 50);
            console.log('SuCCESS   '  + result[0].UnitPrice );
            console.log(result[0].Id);
        } else {
            component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
        }
    });
    $A.enqueueAction(action);

       /* let productId = component.get("v.recordId");
        let action = component.get("c.getProductPrice");
        action.setParam({productId: productId});
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let productEntry = response.getReturnValue();
                console.log('100 ------------- > ' + productEntry);
                let indexMax = productEntry.length - 1;
                component.set("v.productEntryList", productEntry);
                component.set("v.standardPrice", productEntry[indexMax].UnitPrice);
                component.set("v.discountPrice", productEntry[0].Discount_Price__c);
            } else {
                this.doShowToast(component, response.getErrors()[0].message, 'Error' , 'Error');
            }
        });
        $A.enqueueAction(action);*/
    },

    doButtonAmount: function(component, count) {
        let amount = component.get("v.amountProduct");
        let amountInt = parseInt(amount) + count;
        component.set("v.amountProduct", amountInt);
    },

    doAddToBasket: function(component, count) {
        let productId = component.get("v.recordId");
        let productPrice = component.get("v.productEntry.UnitPrice");
        let quantity = component.get("v.amountProduct");
        let addToBasketEvent = $A.get("e.c:AutoParts_AddProductToBasket");
        addToBasketEvent.setParam("productId", productId);
        addToBasketEvent.setParam("productPrice", productPrice);
        addToBasketEvent.setParam("numberOfItem", quantity);
        addToBasketEvent.fire();
    },

    doShowToast: function(component, message, title, typeToast) {
        const toastComponent = component.find('toast');
        if (toastComponent) {
            toastComponent.showToast(message, title, typeToast);
        }
        else {
            console.error("'Toast Component' does not exist");
        }
    },
})