Feature: [SC-05] - Validate activity ranking

    As a user,
    I want to validate the activity rankings returned for each forecast day,
    So that I can confirm the API provides complete and correctly ranked activity recommendations.

    Scenario: [SC-05.1] - Activities have a suitability score from 0 to 100 for each forecast day
        Given the user requests the forecast activity rankings for a valid city for ranked activity list validation
        When the API returns the ranked activity list response
        Then validate that each forecast day contains a ranked list of activities
        And validate that each activity has a suitability score between 0 and 100
