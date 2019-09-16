/**
 * Created by Tomek on 29.08.2019.
 */

public interface TCR_ITrigger {
    void bulkBefore();
    void bulkAfter();

    void beforeInsert(SObject so);
    void beforeUpdate(SObject oldSo, SObject so);
    void beforeDelete(SObject so);

    void afterInsert(SObject so);
    void afterUpdate(SObject oldSo, SObject so);
    void afterDelete(SObject so);
    void afterUndelete(SObject so);

    void andFinally();

}