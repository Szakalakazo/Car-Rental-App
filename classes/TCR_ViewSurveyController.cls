global virtual with sharing class TCR_ViewSurveyController {
    public Boolean isSurveyVisible { get; set; }
    public String qQuestion { get; set; }
    public String qChoices { get; set; }
    public String surveyName { get; set; }
    public String surveyHeader { get; set; }
    public String surveyId {
        get;
        set {
            this.surveyId = value;
            init();
        }
    }
    public String renderSurveyPreview { get; set; }
    public Integer allQuestionsSize { get; set; }
    public String templateURL { get; set; }
    public String surveyThankYouText { get; set; }
    public String surveyContainerCss { get; set; }
    public String surveyThankYouURL { get; set; }
//    public String caseId { get; set; }
//    public String contactId { get; set; }
    public String leadId { get; set; }
    public String anonymousAnswer { get; set; }
    public List<SelectOption> anonymousOrUser { get; set; }
    public Boolean isInternal { get; set; }
    public String baseURL { get; set; }
    public String userId { get; set; }
    public String userName { get; set; }
    public String surveyTakerId { get; set; }
    public Boolean thankYouRendered { get; set; }
    public List<SFQuestion> allQuestions { get; set; }
    public List<String> newOrder { get; set; }

    public TCR_ViewSurveyController(ApexPages.StandardController stdController) {
        surveyId = Apexpages.currentPage().getParameters().get('id');
//        caseId = Apexpages.currentPage().getParameters().get('caId');
//        contactId = Apexpages.currentPage().getParameters().get('cId');
        leadId = Apexpages.currentPage().getParameters().get('lid');

        if (Apexpages.currentPage().getParameters().get('id') != null) {
            isSurveyVisible = true;
        } else {
            isSurveyVisible = false;
        }
        renderSurveyPreview = 'false';
        init();
    }


    public void init() {
        if (surveyId != null) {
            allQuestions = new List<SFQuestion>();
            setupQuestionList();
            setSurveyNameAndThankYou(surveyId);
            anonymousOrUser = new List<SelectOption>();
            anonymousOrUser.add(new SelectOption('Anonymous', System.Label.LABS_SF_Anonymous));
            anonymousOrUser.add(new SelectOption('User', 'User ' + UserInfo.getFirstName() + ' ' + UserInfo.getLastName()));
            anonymousAnswer = 'Anonymous';
            isInternal = true;
            newOrder = new List<String>();
            String urlBase = URL.getSalesforceBaseUrl().toExternalForm();
            baseURL = urlBase;
            userId = UserInfo.getUserId();
            userName = UserInfo.getName();
            String profileId = UserInfo.getProfileId();
            try {
                Profile p = [select Id, UserType from Profile where Id = :profileId];
                if (p.UserType == 'Guest') {
                    isInternal = false;
                } else {
                    isInternal = true;
                }
            } catch (Exception e) {
                isInternal = false;
            }
            thankYouRendered = false;
        }
    }

    public Integer setupQuestionList() {
        getAQuestion();
        return allQuestions.size();
    }

    public void setSurveyNameAndThankYou(String sId) {
        Survey__c s = [SELECT Name, Id, URL__c, Thank_You_Text__c, thankYouText__c, thankYouLink__c, Survey_Header__c, Survey_Container_CSS__c FROM Survey__c WHERE Id = :sId];
        surveyName = s.Name;
        surveyHeader = s.Survey_Header__c;
        templateURL = s.URL__c + 'id=' + sId;
        surveyThankYouText = s.Thank_You_Text__c;
        if (surveyThankYouText == null) {
            surveyThankYouText = System.Label.LABS_SF_Survey_Submitted_Thank_you;
        }
        surveyThankYouURL = s.thankYouLink__c;
        surveyContainerCss = s.Survey_Container_CSS__c;
    }

    public PageReference updateSurveyName() {
        Survey__c s = [SELECT Name, Id, URL__c, thankYouText__c, thankYouLink__c FROM Survey__c WHERE Id = :surveyId];
        s.Name = surveyName;
        try {
            update s;
        } catch (Exception e) {
            ApexPages.addMessages(e);
        }
        return null;
    }

    public PageReference updateSurveyThankYouAndLink() {
        Survey__c s = [SELECT Name, Id, URL__c, thankYouText__c, thankYouLink__c FROM Survey__c WHERE Id = :surveyId];
        s.thankYouText__c = surveyThankYouText;
        s.thankYouLink__c = surveyThankYouURL;
        try {
            update s;
        } catch (Exception e) {
            ApexPages.addMessages(e);
        }
        return null;
    }

    public PageReference refreshQuestionList() {
        setupQuestionList();
        return null;
    }

    private static boolean checkRequired(String response, Survey_Question__c question) {
        if (question.Required__c == true) {
            if (response == null || response == 'NO RESPONSE')
                return false;
        }
        return true;
    }

    public PageReference resultPage() {
        return new PageReference('/apex/ResultsPage?id=' + surveyId);
    }

    public List<String> getResponses() {
        List<SurveyQuestionResponse__c> qr = [Select Survey_Question__c, SurveyTaker__c, Response__c, Name From SurveyQuestionResponse__c limit 100];
        List<String> resp = new List<String>();
        for (SurveyQuestionResponse__c r : qr) {
            resp.add(r.Response__c);
        }
        return resp;
    }

    public List<SFQuestion> getAQuestion() {
        qQuestion = '';
        qChoices = '';
        List<Survey_Question__c> allQuestionsObject = [
                Select s.Type__c, s.Id, s.Survey__c, s.Required__c, s.Question__c,
                        s.OrderNumber__c, s.Name, s.Choices__c
                From Survey_Question__c s
                WHERE s.Survey__c = :surveyId
                ORDER BY s.OrderNumber__c
        ];
        allQuestions = new List<SFQuestion>();

        Double old_OrderNumber = 0;
        Double new_OrderNumber;
        Double difference = 0;
        for (Survey_Question__c q : allQuestionsObject) {
            new_OrderNumber = q.OrderNumber__c;
            difference = new_OrderNumber - old_OrderNumber - 1;
            if (difference > 0) {
                Double dd = double.valueOf(difference);
                Integer newOrderInt = dd.intValue();
                q.OrderNumber__c -= Integer.valueOf(newOrderInt);
            }
            old_OrderNumber = q.OrderNumber__c;
            SFQuestion theQ = new SFQuestion(q);
            allQuestions.add(theQ);
        }
        allQuestionsSize = allQuestions.size();
        return allQuestions;
    }

    public void submitResults() {
        try {
            List <SurveyQuestionResponse__c> sqrList = new List<SurveyQuestionResponse__c>();
            for (SFQuestion q : allQuestions) {
                SurveyQuestionResponse__c sqr = new SurveyQuestionResponse__c();
                if (q.renderSelectRadio == 'true') {
                    if (q.required && (q.selectedOption == null || q.selectedOption == '')) {
                        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Please fill out all required fields'));
                        return;
                    }

                    if (q.selectedOption == null || q.selectedOption == '') {
                        sqr.Response__c = '';
                    } else {
                        sqr.Response__c = q.singleOptions.get(Integer.valueOf(q.selectedOption)).getLabel();
                    }
                    sqr.Survey_Question__c = q.Id;
                    sqrList.add(sqr);
                } else if (q.renderFreeText == 'true') {
                    if (q.required && q.choices == '') {
                        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Please fill out all required fields'));
                        return;
                    }
                    sqr.Response__c = q.choices;
                    sqr.Survey_Question__c = q.Id;
                    sqrList.add(sqr);
                } else if (q.renderSelectCheckboxes == 'true') {
                    if (q.required && (q.selectedOptions == null || q.selectedOptions.size() == 0)) {
                        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Please fill out all required fields'));
                        return;
                    }
                    for (String opt : q.selectedOptions) {
                        sqr = new SurveyQuestionResponse__c();
                        if (opt == '' || opt == null) {
                            sqr.Response__c = '';
                        } else {
                            sqr.Response__c = q.multiOptions.get(Integer.valueOf(opt)).getLabel();
                        }
                        sqr.Survey_Question__c = q.Id;
                        sqrList.add(sqr);
                    }
                } else if (q.renderSelectRow == 'true') {
                    if (q.required && (q.selectedOption == null || q.selectedOption == '')) {
                        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Please fill out all required fields'));
                        return;
                    }
                    if (q.selectedOption == null || q.selectedOption == '') {
                        sqr.Response__c = '';
                    } else {
                        sqr.Response__c = q.rowOptions.get(Integer.valueOf(q.selectedOption)).getLabel();
                    }
                    sqr.Survey_Question__c = q.Id;
                    sqrList.add(sqr);
                }
            }
            if (AddSurveyTaker()) {
                for (SurveyQuestionResponse__c sqr : sqrList) {
                    sqr.SurveyTaker__c = surveyTakerId;
                    sqr.RelatedLead__c = leadId;
                }
                insert sqrList;
                thankYouRendered = true;
            }
        } catch (Exception e) {
            if (isInternal) {
                ApexPages.addMessages(e);
            } else {
                System.debug('Exception: ' + e.getMessage());
                ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.Error, 'Some error occured while saving response'));
            }
        }
    }

    private Boolean AddSurveyTaker() {
        String userId;
        if (surveyId == null) {
            return false;
        }

        SurveyTaker__c st = new SurveyTaker__c();
        st.Survey__c = surveyId;
        st.Taken__c = 'false';
        st.Lead_Id__c = leadId;
        st.Name = 'Survey';

        try {
            INSERT st;
        } catch (DmlException e) {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.Error, 'Some error occured while saving response'));
        }
        surveyTakerId = st.Id;
        return true;
    }
}