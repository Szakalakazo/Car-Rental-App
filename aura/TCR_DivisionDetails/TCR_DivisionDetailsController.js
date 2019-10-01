({
     getId: function(component, event, helper) {
        let id = event.getParam("divisionID");
        component.set("v.fieldId", id );
        component.set("v.isIdFilled", true);
     },

     clearDetails: function(component, event, helper) {
         component.set("v.fieldId", "" );
         component.set("v.isIdFilled", false);
     }
})