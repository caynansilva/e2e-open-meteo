@api
Feature: Activity ranking API

  Scenario Outline: Get activity rankings for a resolved city
    Given the Activity Ranking API is available
    When I request activity rankings for "<city>"
    Then the response status should be 200
    And the response should contain rankings for 7 days
    And every day should rank:
      | Skiing              |
      | Surfing              |
      | Outdoor Sightseeing |
      | Indoor Sightseeing  |

    Examples:
      | city   |
      | London |
      | Paris  |

  Scenario: Return candidate cities for a partial city name
    Given the Activity Ranking API is available
    When I request activity rankings for "Lon"
    Then the response status should be 200
    And the response should list one or more city matches

  Scenario: Reject a city that cannot be resolved
    Given the Activity Ranking API is available
    When I request activity rankings for "NotARealCity"
    Then the response status should be 404
    And the response should identify that the city was not found
