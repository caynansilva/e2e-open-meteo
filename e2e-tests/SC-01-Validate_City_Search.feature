Feature: [SC-01] - Validate city search and resolution

    As a user,
    I want to validate that the API responds correctly to city-based requests,
    So that I can confirm the API is working as expected.

    Scenario: [SC-01.1] - Retrieve activity rankings using an exact city name
        Given the user sends a request with a valid and unique city name
        When the API returns the response
        Then validate that the returned city name matches the city provided in the request

    Scenario: [SC-01.2] - Retrieve possible locations using a partial city name
        Given the user sends a request with a valid partial city name
        When the API returns the response
        Then validate that the response contains results matching the provided partial city name

    Scenario: [SC-01.3] - Return multiple location matches for an ambiguous partial city name
        Given the user sends a request with a valid partial city name that matches multiple locations
        When the API returns the response
        Then validate that multiple matching locations are returned

    Scenario: [SC-01.4] - Limit the number of results returned by a partial city search
        Given the user sends a request with a valid partial city name
        When the API returns the response
        Then validate that matching locations are returned
        And validate that the number of returned results is limited
