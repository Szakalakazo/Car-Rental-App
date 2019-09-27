({
    afterScriptsLoaded: function (component, event, helper) {
        let domEl = component.find("ratingArea").getElement();
        let currentRating = component.get('v.value');
        let readOnly = component.get('v.readOnly');
        let maxRating = 10;
        let callback = function (rating) {
            component.set('v.value', rating);
        }
        component.ratingObj = rating(domEl, currentRating, maxRating, callback, readOnly);
    },

    onValueChange: function (component, event, helper) {
        if (component.ratingObj) {
            let value = component.get('v.value');
            component.ratingObj.setRating(value, false);
        }
    }
})