Feature: [SC-05] - Validate activity ranking

    As a user,
    I want to validate the activity rankings returned for each forecast day,
    So that I can confirm the API provides complete and correctly ranked activity recommendations.

    Scenario: [SC-05.2] - Activities are ordered from highest to lowest suitability for each forecast day
        Given the user requests the forecast activity rankings for a valid city
        When the API returns the response
        Then validate that the activities for each forecast day are ordered from highest to lowest suitability
