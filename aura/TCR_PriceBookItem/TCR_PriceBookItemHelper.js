({
    fireEvent: function(component, event, handler) {
        let recordId = component.get('v.recordId');
        console.log('recordId ' + recordId);

        let appEvent = $A.get("e.c:TCR_ShowPriceBookDetails");
        console.log('1');

        appEvent.setParams({"priceBookId": recordId});
        console.log('2');

        appEvent.fire();
        console.log('fired');
    },
})