@api-contract
@sut
Feature: Activity Ranking API endpoint and response contract

  Scenario: [SC-06.1] - Successful activity request returns HTTP 200
    Given the Activity Ranking API endpoint is available
    When the client sends a GET request for activities using a valid city
    Then validate that the response status is 200
    And validate that the response content type is JSON
