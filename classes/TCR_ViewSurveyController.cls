global virtual with sharing class TCR_ViewSurveyController {

    public static final String SURVEY_ID = 'id';
    public static final String LEAD_ID = 'lid';
    public static final String ANONYMOUS = 'Anonymous';
    public static final String USER = 'User';
    public static final String NO_RESPONSE = 'NO RESPONSE';
    public static final String TRUE_STRING = 'true';
    public static final String FALSE_STRING = 'false';
    public static final String PAGE_ID = '/apex/ResultsPage?id=';
    public Survey__c currentSurvey { get; set; }
    public Boolean isSurveyVisible { get; set; }
    public Boolean isInternal { get; set; }
    public Boolean thankYouRendered { get; set; }
    public Integer allQuestionsSize { get; set; }
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
    public String templateURL { get; set; }
    public String surveyThankYouText { get; set; }
    public String surveyContainerCss { get; set; }
    public String surveyThankYouURL { get; set; }
    public String leadId { get; set; }
    public String anonymousAnswer { get; set; }
    public String baseURL { get; set; }
    public String userId { get; set; }
    public String userName { get; set; }
    public String surveyTakerId { get; set; }
    public List<SelectOption> anonymousOrUser { get; set; }
    public List<SFQuestion> allQuestions { get; set; }
    public List<String> newOrder { get; set; }

    public TCR_ViewSurveyController(ApexPages.StandardController stdController) {
        surveyId = ApexPages.currentPage().getParameters().get(SURVEY_ID);
        leadId = ApexPages.currentPage().getParameters().get(LEAD_ID);
        isSurveyVisible = String.isNotEmpty(surveyId) ? true : false;
        renderSurveyPreview = 'false';
        init();
    }

    public void init() {
        if (surveyId != null) {
            allQuestions = new List<SFQuestion>();
            setupQuestionList();
            setSurveyNameAndThankYou(surveyId);
            anonymousOrUser = new List<SelectOption>();
            anonymousOrUser.add(new SelectOption(ANONYMOUS, System.Label.LABS_SF_Anonymous));
            anonymousOrUser.add(new SelectOption(USER, 'User ' + UserInfo.getFirstName() + ' ' + UserInfo.getLastName()));
            anonymousAnswer = ANONYMOUS;
            isInternal = true;
            newOrder = new List<String>();
            String urlBase = URL.getSalesforceBaseUrl().toExternalForm();
            baseURL = urlBase;
            userId = UserInfo.getUserId();
            userName = UserInfo.getName();
            String profileId = UserInfo.getProfileId();
            try {
                Profile currentProfile = [SELECT Id, UserType FROM Profile WHERE Id = :profileId];
                if (currentProfile.UserType == 'Guest') {
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
        currentSurvey = [
                SELECT Name, Id, URL__c, Thank_You_Text__c, thankYouText__c, thankYouLink__c, Survey_Header__c, Survey_Container_CSS__c
                FROM Survey__c
                WHERE Id = :sId
        ];
        surveyName = currentSurvey.Name;
        surveyHeader = currentSurvey.Survey_Header__c;
        templateURL = currentSurvey.URL__c + 'id=' + sId;
        surveyThankYouText = currentSurvey.Thank_You_Text__c;
        if (surveyThankYouText == null) {
            surveyThankYouText = System.Label.LABS_SF_Survey_Submitted_Thank_you;
        }
        surveyThankYouURL = currentSurvey.thankYouLink__c;
        surveyContainerCss = currentSurvey.Survey_Container_CSS__c;
    }

    public PageReference updateSurveyName() {
        currentSurvey.Name = surveyName;
        try {
            UPDATE currentSurvey;
        } catch (Exception e) {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.Error, e.getMessage()));

        }
        return null;
    }

    public PageReference updateSurveyThankYouAndLink() {
        currentSurvey.thankYouText__c = surveyThankYouText;
        currentSurvey.thankYouLink__c = surveyThankYouURL;
        try {
            UPDATE currentSurvey;
        } catch (Exception e) {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.Error, e.getMessage()));
        }
        return null;
    }

    public PageReference refreshQuestionList() {
        setupQuestionList();
        return null;
    }

    private static boolean checkRequired(String response, Survey_Question__c question) {
        if (question.Required__c == true) {
            if (response == null || response == NO_RESPONSE)
                return false;
        }
        return true;
    }

    public PageReference resultPage() {
        return new PageReference(PAGE_ID + surveyId);
    }

    public List<String> getResponses() {
        List<SurveyQuestionResponse__c> listOfQuestionResponses = [
                Select Survey_Question__c, SurveyTaker__c, Response__c, Name
                From SurveyQuestionResponse__c
                LIMIT 100
        ];
        List<String> listOfResponses = new List<String>();
        for (SurveyQuestionResponse__c tempResponse : listOfQuestionResponses) {
            listOfResponses.add(tempResponse.Response__c);
        }
        return listOfResponses;
    }

    public List<SFQuestion> getAQuestion() {
        qQuestion = '';
        qChoices = '';
        List<Survey_Question__c> allQuestionsObject = [
                Select currentSurvey.Type__c, currentSurvey.Id, currentSurvey.Survey__c, currentSurvey.Required__c, currentSurvey.Question__c,
                        currentSurvey.OrderNumber__c, currentSurvey.Name, currentSurvey.Choices__c
                From Survey_Question__c currentSurvey
                WHERE currentSurvey.Survey__c = :surveyId
                ORDER BY currentSurvey.OrderNumber__c
        ];

        allQuestions = new List<SFQuestion>();
        Double old_OrderNumber = 0;
        Double new_OrderNumber;
        Double difference = 0;
        for (Survey_Question__c question : allQuestionsObject) {
            new_OrderNumber = question.OrderNumber__c;
            difference = new_OrderNumber - old_OrderNumber - 1;
            if (difference > 0) {
                Double doubleValueOfDifference = double.valueOf(difference);
                Integer newOrderInt = doubleValueOfDifference.intValue();
                question.OrderNumber__c -= Integer.valueOf(newOrderInt);
            }
            old_OrderNumber = question.OrderNumber__c;
            SFQuestion theQ = new SFQuestion(question);
            allQuestions.add(theQ);
        }
        allQuestionsSize = allQuestions.size();
        return allQuestions;
    }

    public void submitResults() {
        try {
            List <SurveyQuestionResponse__c> listOfSurveyQuestionReposnses = new List<SurveyQuestionResponse__c>();
            for (SFQuestion question : allQuestions) {
                SurveyQuestionResponse__c surveyQuestionAnswer = new SurveyQuestionResponse__c();
                if (question.renderSelectRadio == TRUE_STRING) {
                    if (question.required && (question.selectedOption == null || question.selectedOption == '')) {
                        addFillAllFieldsMessage();
                        return;
                    }

                    if (question.selectedOption == null || question.selectedOption == '') {
                        surveyQuestionAnswer.Response__c = '';
                    } else {
                        surveyQuestionAnswer.Response__c = question.singleOptions.get(Integer.valueOf(question.selectedOption)).getLabel();
                    }
                    surveyQuestionAnswer.Survey_Question__c = question.Id;
                    listOfSurveyQuestionReposnses.add(surveyQuestionAnswer);
                } else if (question.renderFreeText == TRUE_STRING) {
                    if (question.required && question.choices == '') {
                        addFillAllFieldsMessage();
                        return;
                    }
                    surveyQuestionAnswer.Response__c = question.choices;
                    surveyQuestionAnswer.Survey_Question__c = question.Id;
                    listOfSurveyQuestionReposnses.add(surveyQuestionAnswer);
                } else if (question.renderSelectCheckboxes == TRUE_STRING) {
                    if (question.required && (question.selectedOptions == null || question.selectedOptions.size() == 0)) {
                        addFillAllFieldsMessage();
                        return;
                    }
                    for (String opt : question.selectedOptions) {
                        surveyQuestionAnswer = new SurveyQuestionResponse__c();
                        if (opt == '' || opt == null) {
                            surveyQuestionAnswer.Response__c = '';
                        } else {
                            surveyQuestionAnswer.Response__c = question.multiOptions.get(Integer.valueOf(opt)).getLabel();
                        }
                        surveyQuestionAnswer.Survey_Question__c = question.Id;
                        listOfSurveyQuestionReposnses.add(surveyQuestionAnswer);
                    }
                } else if (question.renderSelectRow == TRUE_STRING) {
                    if (question.required && (question.selectedOption == null || question.selectedOption == '')) {
                        addFillAllFieldsMessage();
                        return;
                    }
                    if (question.selectedOption == null || question.selectedOption == '') {
                        surveyQuestionAnswer.Response__c = '';
                    } else {
                        surveyQuestionAnswer.Response__c = question.rowOptions.get(Integer.valueOf(question.selectedOption)).getLabel();
                    }
                    surveyQuestionAnswer.Survey_Question__c = question.Id;
                    listOfSurveyQuestionReposnses.add(surveyQuestionAnswer);
                }
            }
            if (AddSurveyTaker()) {
                for (SurveyQuestionResponse__c surveyQuestionAnswer : listOfSurveyQuestionReposnses) {
                    surveyQuestionAnswer.SurveyTaker__c = surveyTakerId;
                    surveyQuestionAnswer.RelatedLead__c = leadId;
                }
                INSERT listOfSurveyQuestionReposnses;
                thankYouRendered = true;
            }
        } catch (Exception e) {
            if (isInternal) {
                ApexPages.addMessages(e);
            } else {
                addUnexpectedErrorMessage();
            }
        }
    }

    private Boolean AddSurveyTaker() {
        String userId;
        if (surveyId == null) {
            return false;
        }

        SurveyTaker__c currentSurveyTaker = new SurveyTaker__c();
        currentSurveyTaker.Name = currentSurvey.Name;
        currentSurveyTaker.Survey__c = surveyId;
        currentSurveyTaker.Taken__c = FALSE_STRING;
        currentSurveyTaker.Lead_Id__c = leadId;

        try {
            INSERT currentSurveyTaker;
        } catch (DmlException e) {
            addUnexpectedErrorMessage();
        }
        surveyTakerId = currentSurveyTaker.Id;
        return true;
    }

    private void addFillAllFieldsMessage(){
        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.Error, System.Label.TCR_Survey_Please_Fill_All_Fields));
    }

    private void addUnexpectedErrorMessage(){
        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.Error, System.Label.TCR_Survey_Error));
    }
}