({
    doInit: function(component, event, helper) {
        helper.initImages(component, event, helper);
    },

    handleUploadFinished : function(component, event, helper) {
        let recordId = component.get("v.recordId");
        let docId = event.getParam('files')[0].documentId;
        let setType = component.get('c.setImageType');
        setType.setParams({
            'documentId': docId,
            'imageType': 'image',
            'recordId' : recordId
        });

        setType.setCallback(this, function(response){
            if (response.getState() === "SUCCESS") {
                helper.initImages(component, event,helper);
            } else {
                component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(setType);
        component.set("v.imageType", "image");
    },

    TCR_ReloadRecordPageEvent : function(component, event, helper) {
        console.log('refresh');
        helper.initImages(component, event, helper);
    },
})