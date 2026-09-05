SDET Test
In this test, you'll be given a feature ticket and asked to provide two things:
1.	BDD test criteria written in Gherkin
2.	Automated tests that align with those criteria
This is a specification-first exercise. No implementation exists yet. You are writing the tests before the code, as you would on a real BDD team.  Focus on clarity, coverage, and realistic testing approaches.
Feature Ticket
Title: Activity Ranking API – City-Based Weather Forecast Integration
Description:
As a user, I want to enter a city or town name and receive a ranked list of activities (Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing) for the next 7 days, based on weather conditions.
You are testing an API, not a UI, but for the API to be fit for purpose you need to consider the front end user experience.
Acceptance Criteria:
•	The API accepts a city or town name as input.
o	It will also accept a partial name and return a list of possible matches
•	It fetches 7-day weather data using Open-Meteo.
•	It ranks each day for each activity based on weather suitability.
•	The response includes, per day and per activity: 
o	Date
o	Activity name
o	A measure of how suitable the conditions are
o	Reasoning (e.g., "High snowfall expected", "Clear skies and 22°C")
What to submit
Three deliverables: Gherkin BDD scenarios, runnable automated tests that implement them and a readme.
With no system under test yet, you'll need to make and document your own decisions about:
•	The API contract you are testing against.
•	How you handle the Open-Meteo dependency.
It's expected that the tests fail against the absent implementation. A meaningful red state that pins down the intended behaviour is the goal of a spec-first suite.
Use Cucumber or a similar BDD runner, with TypeScript and any testing libraries you choose. We use AI daily and ask that you do the same.
Submit a public GitHub repository containing:
•	Feature files
•	Automation code
•	README.md with a short overview of your approach, the API contract and assumptions you tested against, and any omissions or trade-offs.

