@api-contract
@sut
Feature: Activity Ranking API endpoint and response contract

  Scenario: [SC-06.6] - Unsupported HTTP method returns HTTP 405
    Given the Activity Ranking API endpoint is available
    When the client sends a POST request to the activities endpoint
    Then validate that the response status is 405
    And validate that the response indicates that the HTTP method is not allowed
