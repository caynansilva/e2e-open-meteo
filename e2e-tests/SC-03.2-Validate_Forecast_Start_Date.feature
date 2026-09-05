Feature: [SC-03] - Validate forecast days

    As a user,
    I want to validate the activity rankings returned for each forecast day,
    So that I can confirm the API provides complete and correctly ranked activity recommendations.

    Scenario: [SC-03.2] - Forecast starts from the next day and does not include the current day
        Given the user sends a request for a valid city
        When the API returns the response
        Then validate that the forecast starts from the next day
        And validate that the current date is not included in the forecast
