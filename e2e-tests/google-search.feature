@ui
Feature: Google search

  Scenario: Open the Google home page
    When the user opens Google
    Then the Google home page is displayed

  Scenario: Display the Google home page elements
    Given the user is on the Google home page
    Then the Google home page elements are displayed

  Scenario: Search for a random term
    Given the user is on the Google home page
    When the user searches for a random term
    Then Google displays the search results
