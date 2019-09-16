trigger TCR_ProductTrigger on Product2 (before insert, before update, before delete, after insert, after update, after delete, after undelete) {
    TCR_TriggerFactory.createHandler(Product2.SObjectType);

}