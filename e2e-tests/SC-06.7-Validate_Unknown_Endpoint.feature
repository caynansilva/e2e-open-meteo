@api-contract
@sut
Feature: Activity Ranking API endpoint and response contract

  Scenario: [SC-06.7] - Unknown endpoint returns HTTP 404
    Given the Activity Ranking API is available
    When the client sends a GET request to an unsupported endpoint
    Then validate that the response status is 404
    And validate that the response indicates that the endpoint was not found
