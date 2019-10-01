public with sharing class TCR_ContentDocumentLinkHandler implements TCR_ITrigger {

    public void bulkBefore() {

    }

    public void bulkAfter() {
    }

    public void beforeInsert(SObject so) {

    }

    public void afterInsert(SObject so) {
        ContentDocumentLink newLink = (ContentDocumentLink) so.clone(true, true);
        newLink.Visibility = 'AllUsers';
        update newLink;
    }

    public void beforeUpdate(SObject oldSo, SObject so) {
    }

    public void afterUpdate(SObject oldSo, SObject so) {
    }

    public void beforeDelete(SObject so) {
    }

    public void afterDelete(SObject so) {
    }

    public void afterUndelete(SObject so) {
    }

    public void andFinally() {
    }
}