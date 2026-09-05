Feature: [SC-01] - Validate city search and resolution

    As a user,
    I want to validate that the API responds correctly to city-based requests,
    So that I can confirm the API is working as expected.

    Scenario: [SC-01.3] - Return multiple location matches for an ambiguous partial city name
        Given the user sends a request with a valid partial city name that matches multiple locations
        When the API returns the response
        Then validate that multiple matching locations are returned
