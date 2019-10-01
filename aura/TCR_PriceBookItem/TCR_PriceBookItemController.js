({
    handleOpenModal: function (component, event, helper) {
        helper.fireEvent(component, event, helper);
    },

    handleDeletePriceBook: function (component, event, helper) {
        helper.deletePriceBook(component, event, helper);
    },
})