Feature: [SC-02] - Validate the API response contract

    As a user,
    I want to validate the API response contract,
    So that I can confirm the API provides complete activity recommendations.

    Scenario: [SC-02.2] - Validate that the response contract contains all required fields
        Given the user sends a request with a valid and unique city name
        When the API returns the response
        Then validate that all fields defined by the API contract are present in the response
