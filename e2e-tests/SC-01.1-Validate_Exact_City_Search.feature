Feature: [SC-01] - Validate city search and resolution

    As a user,
    I want to validate that the API responds correctly to city-based requests,
    So that I can confirm the API is working as expected.

    Scenario: [SC-01.1] - Retrieve activity rankings using an exact city name
        Given the user sends a request with a valid and unique city name
        When the API returns the response
        Then validate that the returned city name matches the city provided in the request
