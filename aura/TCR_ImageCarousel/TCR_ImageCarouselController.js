({
    doInit: function (component, event, helper) {
/*        let action = component.get("c.getProductImage");
        action.setParams({
            'recordId': component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let listPath = response.getReturnValue();
                component.set("v.images", listPath.images);
                component.set("v.posterPath", listPath.poster);
            } else {
                console.log('FAILURE  1-----> ');
                component.find("toastCmp").showToastModel(response.getError()[0].message, "error");
            }
        });
        $A.enqueueAction(action);*/
    },

    goLeft: function (component, event, helper) {
        let position = component.get('v.position');
        let y = 0;
        if (position > 94) {
            y = 95;
        } else {
            y = position;
        }
        let x = 1;
        let timeoutHandler = function (i) {
            if (i < y) {
                component.set('v.position', position - i);
                i += 3;
                setTimeout(() => {
                        timeoutHandler(i);
                    }
                    , 15);
            }
        };
        setTimeout(() => {
                timeoutHandler(x);
            }, 15
        );
    },

    goRight: function (component, event, helper) {
        let position = component.get('v.position');
        let y = 0;
        if (position + 95 < component.get('v.maxPosition')) {
            y = 95;
        } else {
            y = component.get('v.maxPosition') - position;
        }
        let x = 1;
        let timeoutHandler = function (i) {
            if (i < y) {
                component.set('v.position', position + i);
                i += 3;
                setTimeout(() => {
                        timeoutHandler(i);
                    }
                    , 15);
            }
        };
        setTimeout(() => {
                timeoutHandler(x);
            }, 15
        );
    },

    handleResize: function (component, event, helper) {
        let max = component.find('wrapper').getElement().scrollWidth;
        let shown = component.find('inner').getElement().offsetWidth;
        if ((max - shown) === 0) {
            component.set('v.maxPosition', 1);
        } else {
            component.set('v.maxPosition', shown - max);
        }
    },

    openImage: function (component, event, controller) {
        console.log('10');
        let index = event.currentTarget.dataset.index;
        console.log('11');
        let images = component.get('v.images');
        console.log('12');
        console.log(images[index]);
        component.set("v.selectedImage", images[index].ContentDownloadUrl);
        component.set('v.isOpen', true);
    },

    closeModel: function (component, event, helper) {
        component.set("v.isOpen", false);
    },
})