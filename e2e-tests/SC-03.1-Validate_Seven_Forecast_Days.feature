Feature: [SC-03] - Validate forecast days

    As a user,
    I want to validate the activity rankings returned for each forecast day,
    So that I can confirm the API provides complete and correctly ranked activity recommendations.

    Scenario: [SC-03.1] - Response contains exactly 7 forecast days
        Given the user sends a request for a valid city for the seven day forecast
        When the API returns the seven day forecast response
        Then validate that the response contains exactly 7 forecast days
