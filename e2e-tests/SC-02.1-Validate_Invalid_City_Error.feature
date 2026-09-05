Feature: [SC-02] - Validate the API response contract

    As a user,
    I want to validate the API response contract,
    So that I can confirm the API provides complete activity recommendations.

    Scenario: [SC-02.1] - Return an appropriate error when the city does not exist
        Given the user sends a request with an invalid city name
        When the API returns the response
        Then validate that a clear error response indicates that the city could not be found
