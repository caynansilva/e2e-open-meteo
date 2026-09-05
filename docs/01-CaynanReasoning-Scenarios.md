# Inputs:
- Only the City Name or Partial City Name

---

# Outputs:
- Array of Matching City Name with
-- City Name
-- Array of Days
--- Date
--- activity
--- ranking
--- reasoning

---

# Considerations:
- We need to check the location, it is not possible to recomend an activity if we don't know the location type. Like we can't recomment Skiing on the Coast or Surfing in the mountains.
- I'll assume that the tool api has the location type for each city that it will visit.
- We need to consider the wheater variables for each activity and consider the risks of recomending a dangerous activity to a client, this can led to legal issues.
- As we don't have the API contracts or code implementation yet we need to assume the outputs but make it more fit to changes as possible.
- The dependency of the OpenMeteo is a decision problem ... if the company needs o use the tool I would recomend they to host their own endpoints and not use the public api for testing, because this will grant more reliability on the service.
- But the use of the tool is good because it is well documented and easy to configure.
- Should the API contracts have only what the doc says or what it is correct?
- Like the correct way is to separate the activities, city, locations, wheater into multiple endpoins and create a main Call that returns what we need after a processing.

---

# Scenarios
scenario: retrieve activity rankings using an exact city name
scenario: retrieve possible locations using a partial city name
scenario: return multiple location matches for an ambiguous partial city name
scenario: limit the number of results returned by a partial city search
scenario: return an appropriate error when the city does not exist
scenario: response contract contains all required fields
scenario: weather conditions impact activity suitability rankings
scenario: response contains exactly 7 forecast days
scenario: each forecast day contains all required activity fields
scenario: activities are ranked by suitability from 0 to 100 for each day
scenario: every activity includes reasoning explaining its suitability score
scenario: forecast starts from the next day and does not include the current day
scenario: every forecast day contains all supported activities
scenario: activities are ordered from highest to lowest suitability for each day
scenario: suitability values are always within the accepted range of 0 to 100
scenario: response dates are sequential with no missing or duplicated days


---
# Contracts

For now we don't have the contract but it is good to assume a structure like:

//In my mind
{
    cityCode: 0,
    cityName: random city,
    locationCode: 0, //
    currentDate: 2026-09-04,
    nextDaysActivities: [
        {
            date: 2026-09-05,
            ranking: 100, //0 to 100
            recommendActivityCode: 0,
            reasoningText: "Reasoning"
            wheaterId: 0
        },
        {
            date: 2026-09-06,
            ranking: 100, //0 to 100
            recommendActivityCode: 0,
            reasoningText: "Reasoning"
            wheaterId: 0
        },
        {
            date: 2026-09-07,
            ranking: 100, //0 to 100
            recommendActivityCode: 0,
            reasoningText: "Reasoning"
            wheaterId: 0
        },
        {
            date: 2026-09-08,
            ranking: 100, //0 to 100
            recommendActivityCode: 0,
            reasoningText: "Reasoning"
            wheaterId: 0
        },
        {
            date: 2026-09-09,
            ranking: 100, //0 to 100
            recommendActivityCode: 0,
            reasoningText: "Reasoning"
            wheaterId: 0
        },
        {
            date: 2026-09-10,
            ranking: 100, //0 to 100
            recommendActivityCode: 0,
            reasoningText: "Reasoning"
            wheaterId: 0
        },
        {
            date: 2026-09-11,
            ranking: 100, //0 to 100
            recommendActivityCode: 0,
            reasoningText: "Reasoning"
            wheaterId: 0
        },
    ]
}


//Wheater 
// When the user sends a request it already register in the database the conditions of the day and update only one time per hour this will help to not overload the requests system
[
    {
        wheaterId: 0
        cityCode: 0,
        date: 2026-09-05,
        conditions: {
            minTemperature: 0,
            maxTemperature: 0,
            precipitationProbability: 0.
            snowfall: 0,
            seaLevel: 0,
            visibility: 0,
            cloudCoverTotal: 0
        }
    }
]



//locationCode
[
    {
        locationCode: 0,
        locationName: Mountains,
        locationDesc: Middle of the Mountains,
    },
    {
        locationCode: 1,
        locationName: Coast,
        locationDesc: Sea Coast,
    },
    {
        locationCode: 2,
        locationName: City,
        locationDesc: City Interior,
    },
    {
        locationCode: 3,
        locationName: Forest,
        locationDesc: Close to the Forest,
    },
]

//ActivitiesCode
[
    {
        activityCode: 0,
        activityName: "Indoors",
        activityDesc: "Indoor Sightseeing",
        locations: [
            0, 1, 2, 3
        ]
    },
    {
        activityCode: 1,
        activityName: "Outdoors",
        activityDesc: "Outdoor Sightseeing"
        locations: [
            0, 1, 2, 3
        ]
    },
    {
        activityCode: 2,
        activityName: "Surfing",
        activityDesc: "Surfing"
        locations: [
            1
        ]
    },
    {
        activityCode: 3,
        activityName: "Skiing",
        activityDesc: "Skiing"
        locations: [
            0
        ]
    },
]


I'm overcomplicating the scearios ...
It is out of the scope of what the test asked.

Lets go with the safe approach!

{
  "city": "London",
  "days": [
    {
      "date": "2026-09-04",
      "activities": [
        {
          "date": "2026-09-05",
          "dayActivities": [
            {
                "Skiing",
                "suitability": 100,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Surfing",
                "suitability": 0,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Indoor  Sightseeing",
                "suitability": 20,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Outdoor Sightseeing",
                "suitability": 80,
                "reasoning": "Clear skies and mild temperature"
            }
          ],
        },
        {
          "date": "2026-09-06",
          "dayActivities": [
            {
                "Skiing",
                "suitability": 100,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Surfing",
                "suitability": 0,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Indoor  Sightseeing",
                "suitability": 20,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Outdoor Sightseeing",
                "suitability": 80,
                "reasoning": "Clear skies and mild temperature"
            }
          ],
        },
        {
          "date": "2026-09-07",
          "dayActivities": [
            {
                "Skiing",
                "suitability": 100,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Surfing",
                "suitability": 0,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Indoor  Sightseeing",
                "suitability": 20,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Outdoor Sightseeing",
                "suitability": 80,
                "reasoning": "Clear skies and mild temperature"
            }
          ],
        },
        {
         "date": "2026-09-08",
          "dayActivities": [
            {
                "Skiing",
                "suitability": 100,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Surfing",
                "suitability": 0,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Indoor  Sightseeing",
                "suitability": 20,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Outdoor Sightseeing",
                "suitability": 80,
                "reasoning": "Clear skies and mild temperature"
            }
          ],
        },
        {
         "date": "2026-09-09",
          "dayActivities": [
            {
                "Skiing",
                "suitability": 100,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Surfing",
                "suitability": 0,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Indoor  Sightseeing",
                "suitability": 20,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Outdoor Sightseeing",
                "suitability": 80,
                "reasoning": "Clear skies and mild temperature"
            }
          ],
        },
        {
         "date": "2026-09-10",
          "dayActivities": [
            {
                "Skiing",
                "suitability": 100,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Surfing",
                "suitability": 0,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Indoor  Sightseeing",
                "suitability": 20,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Outdoor Sightseeing",
                "suitability": 80,
                "reasoning": "Clear skies and mild temperature"
            }
          ],
        },
        {
         "date": "2026-09-11",
          "dayActivities": [
            {
                "Skiing",
                "suitability": 100,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Surfing",
                "suitability": 0,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Indoor  Sightseeing",
                "suitability": 20,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Outdoor Sightseeing",
                "suitability": 80,
                "reasoning": "Clear skies and mild temperature"
            }
          ],
        }
      ]
    }
  ]
}

I think that this is how the output is with all activities in each day, not one actitiy per day:

As a user, I want to enter a city or town name and receive a ranked list of activities (Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing) for the next 7 days, based on weather conditions.

"activities": 
        {
          "date": "2026-09-05",
          "dayActivities": [
            {
                "Skiing",
                "suitability": 100,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Surfing",
                "suitability": 0,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Indoor  Sightseeing",
                "suitability": 20,
                "reasoning": "Clear skies and mild temperature"
            },
            {
                "Outdoor Sightseeing",
                "suitability": 80,
                "reasoning": "Clear skies and mild temperature"
            }
          ],
        },