public class TCR_TriggerFactory {

    public static void createHandler(Schema.sObjectType soType) {
        TCR_ITrigger handler = getHandler(soType);

        if (handler == null) {
            throw new TriggerException('No Trigger Handler registered for Object Type: ' + soType);
        }
        execute(handler);
    }

    private static TCR_ITrigger getHandler(Schema.sObjectType soType) {

        if (soType == ContentDocumentLink.SObjectType) {
            return new TCR_ContentDocumentLinkHandler();
        }

        return null;
    }

    public static void execute(TCR_ITrigger triggerHandler) {
        if (Trigger.isBefore) {
            triggerHandler.bulkBefore();

            if (Trigger.isInsert) {
                for (SObject so : Trigger.new) {
                    triggerHandler.beforeInsert(so);
                }
            } else if (Trigger.isUpdate) {
                for (SObject so : Trigger.old) {
                    triggerHandler.beforeUpdate(so, Trigger.newMap.get(so.Id));
                }
            } else if (Trigger.isDelete) {
                for (SObject so : Trigger.old) {
                    triggerHandler.beforeDelete(so);
                }
            }
        } else {
            triggerHandler.bulkAfter();
            if (Trigger.isInsert) {
                for (SObject so : Trigger.new) {
                    triggerHandler.afterInsert(so);
                }
            } else if (Trigger.isUpdate) {
                for (SObject so : Trigger.old) {
                    triggerHandler.afterUpdate(so, Trigger.newMap.get(so.Id));
                }
            } else if (Trigger.isDelete) {
                for (SObject so : Trigger.old) {
                    triggerHandler.afterDelete(so);
                }
            } else if (Trigger.isUndelete) {
                for (SObject so : Trigger.new) {
                    triggerHandler.afterUndelete(so);
                }
            }
        }
        triggerHandler.andFinally();
    }
    private class TriggerException extends Exception {
    }
}