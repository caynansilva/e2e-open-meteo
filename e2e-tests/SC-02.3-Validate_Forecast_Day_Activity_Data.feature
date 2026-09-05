Feature: [SC-02] - Validate the API response contract

    As a user,
    I want to validate the API response contract,
    So that I can confirm the API provides complete activity recommendations.

    Scenario: [SC-02.3] - Each forecast day contains all required activity data
        Given the user requests the forecast activity rankings for a valid city for forecast activity data
        When the API returns the forecast activity data response
        Then validate that each forecast day contains the required activity data
