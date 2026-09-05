Feature: [SC-01] - Validate city search and resolution

    As a user,
    I want to validate that the API responds correctly to city-based requests,
    So that I can confirm the API is working as expected.

    Scenario: [SC-01.4] - Limit the number of results returned by a partial city search
        Given the user sends a request with a valid partial city name
        When the API returns the response
        Then validate that matching locations are returned
        And validate that the number of returned results is limited
