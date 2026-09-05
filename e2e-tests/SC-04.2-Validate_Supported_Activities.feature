Feature: [SC-04] - Validate activity recommendations

    As a user,
    I want to validate the activity recommendations returned for each forecast day,
    So that I can confirm the API provides complete and correctly ranked activity recommendations.

    Scenario: [SC-04.2] - Every forecast day contains all supported activities
        Given the user requests the forecast activity rankings for a valid city
        When the API returns the response
        Then validate that every forecast day contains all supported activities
