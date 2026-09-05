@api-contract
@sut
Feature: Activity Ranking API endpoint and response contract

  Scenario: [SC-06.3] - Empty city parameter returns HTTP 400
    Given the Activity Ranking API endpoint is available
    When the client sends a GET request with an empty city parameter
    Then validate that the response status is 400
    And validate that the response contains a clear client error
