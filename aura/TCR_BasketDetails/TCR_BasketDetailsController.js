({
    init: function (component, event, helper) {
        console.log('init');
        helper.doInit(component);
        helper.initTotalPrice(component);
    },

    deleteItemFromItemList: function (component, event, helper) {
        helper.doRemoveFromCart(component, event, helper);
    },

    handleGoToRecordPage: function (component, event, helper) {
        helper.doGoToRecordPage(component, event, helper);
    },

    displayConfirmation: function (component, event, helper) {
        $A.enqueueAction(component.get('c.init'));
        component.set('v.showSummary', true);
    },

    addDay: function (component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCart = JSON.parse(sessionStorage.getItem('user-cart' + userId));
        let index = event.currentTarget.dataset.index;
        let singleItemOnList = sessionUserCart[index];
        singleItemOnList.quantity = singleItemOnList.quantity + 1;
        singleItemOnList.totalPriceForItem = singleItemOnList.quantity * singleItemOnList.price;
        sessionUserCart[index] = singleItemOnList;
        sessionStorage.setItem('user-cart' + userId, JSON.stringify(sessionUserCart));
        helper.doInit(component);
        helper.initTotalPrice(component);
    },

    subtractDay: function (component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let sessionUserCart = JSON.parse(sessionStorage.getItem('user-cart' + userId));
        let index = event.currentTarget.dataset.index;
        let singleItemOnList = sessionUserCart[index];
        if(singleItemOnList.quantity > 1){
            singleItemOnList.quantity = singleItemOnList.quantity - 1;
            singleItemOnList.totalPriceForItem = singleItemOnList.quantity * singleItemOnList.price;
            sessionUserCart[index] = singleItemOnList;
            sessionStorage.setItem('user-cart' + userId, JSON.stringify(sessionUserCart));
            helper.doInit(component);
            helper.initTotalPrice(component);
        }

    }
})