({
    onSelect: function (component, event, helper) {
        component.set("v.openModal", true);
    },

    closeModel : function(component, event, helper) {
        component.set("v.openModal", false);
    },

    deleteImage : function(component, event, helper) {
        let distribution = component.get("v.distribution");
        let docId = distribution.ContentDocumentId;
        let deleteAction = component.get('c.deleteDocument');
        deleteAction.setParams({
            'documentId': docId
        });
        deleteAction.setCallback(this, function(response){
            console.log(response.getState());
            if (response.getState() === "SUCCESS") {
                component.set("v.openModal", false);
                let reloadImages = $A.get("e.c:TCR_ReloadRecordPageEvent");
                reloadImages.fire();
            } else {
                component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(deleteAction);
    },

    selectPoster : function(component, event, helper) {
        let recordId = component.get("v.recordId");
        let distribution = component.get("v.distribution");
        let docId = distribution.ContentDocumentId;
        console.log('1');
        let setType = component.get('c.setImageType');
        setType.setParams({
            'documentId': docId,
            'imageType': "poster",
            'recordId' : recordId
        });
        console.log('2');
        setType.setCallback(this, function(response){
            console.log('3');
            if (response.getState() === "SUCCESS") {
                console.log(response.getReturnValue());
                component.set("v.openModal", false);
                let reload = $A.get("e.c:TCR_ReloadRecordPageEvent");
                reload.fire();
            } else {
                component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(setType);
    },
})