@api-contract
@sut
Feature: Activity Ranking API endpoint and response contract

  Scenario: [SC-06.5] - Invalid result limit returns HTTP 400
    Given the Activity Ranking API endpoint is available
    When the client searches for cities using an invalid result limit
    Then validate that the response status is 400
    And validate that the response contains a clear client error
