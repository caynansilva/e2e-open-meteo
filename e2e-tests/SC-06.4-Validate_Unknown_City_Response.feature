@api-contract
@sut
Feature: Activity Ranking API endpoint and response contract

  Scenario: [SC-06.4] - Unknown city returns HTTP 404
    Given the Activity Ranking API endpoint is available
    When the client sends a GET request for an unknown city
    Then validate that the response status is 404
    And validate that the response indicates that the city was not found
