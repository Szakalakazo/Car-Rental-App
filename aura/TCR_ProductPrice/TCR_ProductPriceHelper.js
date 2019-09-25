({
    doInit: function (component, event, helper) {
        let action = component.get("c.getProductPrice");
        action.setParams({
            'productId': component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let result = response.getReturnValue()
                console.log('results ---->  '  + JSON.stringify(result));
                component.set("v.productEntryList", result);
                component.set("v.standardPrice", result[0].UnitPrice);
                component.set("v.discountPrice", result[result.length - 1].Discount_Price__c);
                console.log('lalalalal ' + component.get("v.discountPrice"));
            } else {
                component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(action);
    },

    doButtonAmount: function (component, count) {
        let amount = component.get("v.amountProduct");
        let amountInt = parseInt(amount) + count;
        component.set("v.amountProduct", amountInt);
    },

    doAddToBasket: function (component, count) {
        let currentProduct = component.get("v.productItem");
        let productPrice = component.get("v.standardPrice");
        let quantity = component.get("v.amountProduct");
        let totalPriceForItem = quantity * productPrice;
        let posterURL = component.get('v.posterURL.ContentDownloadUrl');

        let productToBasket = {
            price: productPrice,
            product: currentProduct,
            quantity: quantity,
            totalPriceForItem: totalPriceForItem,
            posterURL: posterURL
        };

        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCartJSON = sessionStorage.getItem('user-cart' + userId);

        if (!$A.util.isUndefinedOrNull(sessionUserCartJSON)) {
            let userShoppingList = JSON.parse(sessionUserCartJSON);
            let isItemInShoppingList = userShoppingList.filter(function (x) {
                return x.product.Id == currentProduct.Id;
            });
            if (isItemInShoppingList.length === 0) {
                userShoppingList.push(productToBasket);
                sessionStorage.setItem('user-cart' + userId, JSON.stringify(userShoppingList));
                component.find("toastCmp").showToastModel("PRODUCT ADDED TO CART", "success");

                let addItemToBasketEvent = $A.get("e.c:TCR_AddProductToBasket");
                addItemToBasketEvent.setParam('amountOfProduct', userShoppingList.length);
                addItemToBasketEvent.fire();
            } else {
                component.find("toastCmp").showToastModel("PRODUCT ALREADY  IN CART", "error");
            }
        } else {
            let userShoppingList = [productToBasket];
            sessionStorage.setItem('user-cart' + userId, JSON.stringify(userShoppingList));
            component.find("toastCmp").showToastModel("PRODUCT ADDED TO CART", "success");
            let addItemToBasketEvent = $A.get("e.c:TCR_AddProductToBasket");
            addItemToBasketEvent.setParam('amountOfProduct', userShoppingList.length);
            addItemToBasketEvent.fire();
        }
    },

    doShowToast: function (component, message, title, typeToast) {
        const toastComponent = component.find('toast');
        if (toastComponent) {
            toastComponent.showToast(message, title, typeToast);
        } else {
            console.error("'Toast Component' does not exist");
        }
    }
})