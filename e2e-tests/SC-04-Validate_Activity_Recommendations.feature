Feature: [SC-04] - Validate activity recommendations

    As a user,
    I want to validate the activity recommendations returned for each forecast day,
    So that I can confirm the API provides complete and correctly ranked activity recommendations.

    Scenario: [SC-04.1] - Weather conditions impact activity suitability rankings
        Given the user requests the forecast activity rankings for a valid city
        When the API returns the response
        Then validate that activity suitability is determined based on the weather conditions for each forecast day

    Scenario: [SC-04.2] - Every forecast day contains all supported activities
        Given the user requests the forecast activity rankings for a valid city
        When the API returns the response
        Then validate that every forecast day contains all supported activities

    Scenario: [SC-04.3] - Every activity includes reasoning for its suitability
        Given the user requests the forecast activity rankings for a valid city
        When the API returns the response
        Then validate that every activity includes reasoning explaining its suitability
