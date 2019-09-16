trigger TCR_ContentDocumentLinkTrigger on ContentDocumentLink (after insert, after update) {
    TCR_TriggerFactory.createHandler(ContentDocumentLink.SObjectType);
}
