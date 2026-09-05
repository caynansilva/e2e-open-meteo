Feature: [SC-03] - Validate forecast days

    As a user,
    I want to validate the activity rankings returned for each forecast day,
    So that I can confirm the API provides complete and correctly ranked activity recommendations.

    Scenario: [SC-03.3] - Forecast dates are sequential without missing or duplicated days
        Given the user sends a request for a valid city
        When the API returns the response
        Then validate that the forecast dates are sequential
        And validate that there are no missing or duplicated forecast days
