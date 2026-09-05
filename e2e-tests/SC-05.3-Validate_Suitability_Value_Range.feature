Feature: [SC-05] - Validate activity ranking

    As a user,
    I want to validate the activity rankings returned for each forecast day,
    So that I can confirm the API provides complete and correctly ranked activity recommendations.

    Scenario: [SC-05.3] - Suitability values remain within the accepted range
        Given the user requests the forecast activity rankings for a valid city for suitability range validation
        When the API returns the suitability range response
        Then validate that all activity suitability values are between 0 and 100
