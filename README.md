ads.json was generated using the help of an LLM (DeepSeek). It was provided the fields, and then requested to generate 70 ads of a variety of categories. Then, it was requested to generate 30 additional ads of sensitive categories.

# Endpoints

## /getad

- Returns the "best" ad based on optional targeting criteria.

Parameters:

- keywords
- locations
- categories
- excludeKeywords
- excludeLocations
- excludeCategories

Returns:
An ad as JSON, with the format:

{
"id": 1,
"title": "Bay Area Electric Bikes",
"description": "Ride through San Francisco in style with our eco-friendly electric bikes. Free delivery in SF!",
"keywords": ["bikes", "electric", "transportation", "eco-friendly", "San Francisco", "Bay Area"],
"url": "https://example.com/e-bikes",
"city": "San Francisco",
"state": "California",
"country": "USA",
"category": ["Shopping", "Sports & Recreation", "Autos & Vehicles"],
"locations": ["San Francisco", "Bay Area"],
}

## Scoring Logic

Ads are scored based on matches with requested keywords, locations, and categories. Excluded ads are never returned. If multiple ads have the same score, one is randomly selected.
