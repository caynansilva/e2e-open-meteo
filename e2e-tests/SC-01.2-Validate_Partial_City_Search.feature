Feature: [SC-01] - Validate city search and resolution

    As a user,
    I want to validate that the API responds correctly to city-based requests,
    So that I can confirm the API is working as expected.

    Scenario: [SC-01.2] - Retrieve possible locations using a partial city name
        Given the user sends a request with a valid partial city name
        When the API returns the response
        Then validate that the response contains results matching the provided partial city name
