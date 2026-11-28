# Kiwi.com Unofficial SDK

Unofficial **Kiwi.com API** client for Python, JavaScript/TypeScript, Go, PHP, Ruby, Java and C#. Search and compare flights on Kiwi.com — itineraries with live prices, airlines, routes and departure/arrival times, plus location and route discovery.

- **11 endpoints**, each returning JSON, with one method per endpoint in every language.
- **Works with no setup.** With no key, a client uses a shared demo key (30 requests a minute and 300 a day per network).
- **Your own key lifts the limit.** [Create a free key](https://maviapi.com/sign-up?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi): a 7-day trial with 5,000 credits, no card.
- **Kept working.** The API is hosted by [maviapi](https://maviapi.com/apis/kiwi?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi), which monitors it and repairs it when the website changes.

> This project is not affiliated with, endorsed by or sponsored by Kiwi.com (kiwi.com). All trademarks belong to their owners.

## Quick start

### Python

```bash
pip install "git+https://github.com/maviapi-sdks/kiwi-unofficial-sdk#subdirectory=python"
```

```python
from kiwi_sdk import KiwiClient

client = KiwiClient()  # or KiwiClient("mvk_live_...")
result = client.search(from_="london", to="istanbul")
print(result)
```

### JavaScript / TypeScript

```bash
npm install github:maviapi-sdks/kiwi-unofficial-sdk
```

```javascript
import { KiwiClient } from "kiwi-unofficial-sdk";

const client = new KiwiClient(); // or new KiwiClient({ apiKey: "mvk_live_..." })
const result = await client.search({ from: "london", to: "istanbul" });
console.log(result);
```

### Go

```bash
go get github.com/maviapi-sdks/kiwi-unofficial-sdk
```

```go
package main

import (
	"context"
	"fmt"
	"log"

	kiwi "github.com/maviapi-sdks/kiwi-unofficial-sdk"
)

func main() {
	client := kiwi.New("") // or kiwi.New("mvk_live_...")
	result, err := client.Search(context.Background(), kiwi.Params{"from": "london", "to": "istanbul"})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(result))
}
```

### PHP

```bash
composer config repositories.kiwi-unofficial-sdk vcs https://github.com/maviapi-sdks/kiwi-unofficial-sdk
composer require maviapi-sdks/kiwi-unofficial-sdk:dev-main
```

```php
<?php

require 'vendor/autoload.php';

use KiwiSdk\KiwiClient;

$client = new KiwiClient(); // or new KiwiClient('mvk_live_...')
$result = $client->search(from: 'london', to: 'istanbul');
print_r($result);
```

### Ruby

```ruby
# Gemfile
gem "kiwi_sdk", git: "https://github.com/maviapi-sdks/kiwi-unofficial-sdk", branch: "main"
```

```ruby
require "kiwi_sdk"

client = KiwiSdk::Client.new # or KiwiSdk::Client.new(api_key: "mvk_live_...")
result = client.search(from: "london", to: "istanbul")
puts result
```

### Java

```xml
<!-- pom.xml: the JitPack repository, then the dependency -->
<repository>
  <id>jitpack.io</id>
  <url>https://jitpack.io</url>
</repository>

<dependency>
  <groupId>com.github.maviapi-sdks</groupId>
  <artifactId>kiwi-unofficial-sdk</artifactId>
  <version>main-SNAPSHOT</version>
</dependency>
```

The client is one file with no dependencies, so you can also copy [`KiwiClient.java`](java/src/main/java/com/maviapi/kiwi/KiwiClient.java) into your project.

```java
import com.maviapi.kiwi.KiwiClient;
import java.util.Map;

public class Example {
    public static void main(String[] args) {
        KiwiClient client = new KiwiClient(); // or new KiwiClient("mvk_live_...")
        String json = client.search(Map.of("from", "london", "to", "istanbul"));
        System.out.println(json);
    }
}
```

### C#

```bash
git clone https://github.com/maviapi-sdks/kiwi-unofficial-sdk
dotnet add reference kiwi-unofficial-sdk/csharp/KiwiSdk.csproj
```

The client is one file with no dependencies, so you can also copy [`KiwiClient.cs`](csharp/KiwiClient.cs) into your project.

```csharp
using KiwiSdk;

var client = new KiwiClient(); // or new KiwiClient("mvk_live_...")
var result = await client.SearchAsync(new Dictionary<string, object?> { ["from"] = "london", ["to"] = "istanbul" });
Console.WriteLine(result);
```

## Endpoints

| Endpoint | What it returns | Credits per call |
|---|---|---|
| [`GET /airports-near`](#get-airports-near) | Airports within a radius of a point, nearest first, with distance, city, country, time zone and Kiwi popularity. | 5 |
| [`GET /explore`](#get-explore) | The cheapest flight to every destination city from a place, like kiwi.com's 'anywhere' search: one row per city with price, origin and destination airports, local and UTC times and, for round trips, nights and return date. | 5 |
| [`GET /explore-v2`](#get-explore-v2) | The cheapest flight to every destination city from a place, like kiwi.com's 'anywhere' search, with that flight on every row: airlines, stops, duration, local and UTC departure and arrival, segments and booking link (and the return leg for round trips). | 5 |
| [`GET /places`](#get-places) | Kiwi locations of one type matching a name or IATA code, best match first. | 5 |
| [`GET /places-v2`](#get-places-v2) | Kiwi locations of every type matching a name or code, best match first; each row has its country and a search_id for the flight searches. | 5 |
| [`GET /places/{id}`](#get-placesid) | One Kiwi location by id or code: name, type, codes, city, country, region, continent, time zone, population and coordinates. | 5 |
| [`GET /revalidate`](#get-revalidate) | Checks one itinerary from /search, /search-v2 or /search-v3 again before booking: whether the same flights are still on sale, their current total price for these passengers and currency, a fresh booking link and segments, fetched_at and expires_at. | 5 |
| [`GET /routes`](#get-routes) | Published city-pair routes (cheap-flights pages) from one of Kiwi's route sitemaps, in sitemap order. | 5 |
| [`GET /search`](#get-search) | Flight itineraries for one departure day (and optional return day): prices, airlines, segments, local and UTC times and booking links, as kiwi.com ranks them (at most 25 per search). | 5 |
| [`GET /search-v2`](#get-search-v2) | Flight itineraries for departure (and optional return) date windows, with prices, segments, airlines, local and UTC times and booking links. | 5 |
| [`GET /search-v3`](#get-search-v3) | Every itinerary kiwi.com has for up to 3 origins and 3 destinations over departure (and return) date windows, with local departure and arrival time windows. | 5 |

Try each one in the browser on the [Kiwi.com API page](https://maviapi.com/apis/kiwi?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi).

## Authentication

A client takes the key you give it. With none, it reads the `MAVIAPI_API_KEY` environment variable, and then uses the shared demo key (30 requests a minute and 300 a day per network). To get your own, [sign up](https://maviapi.com/sign-up?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi) and create a key on the [keys page](https://maviapi.com/dashboard/keys). A successful request uses the credits its endpoint lists; a failed request is free. Plans are on the [pricing page](https://maviapi.com/pricing?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi).

## Errors

A request the API answers with an error status raises an `ApiError` (in Go, returns an `*Error`) with the HTTP status, a machine-readable code and a message. In Java it carries the status and the response body.

| Status | Code | Meaning |
|---|---|---|
| 400 | `bad_request` | A parameter is missing or cannot be used (`bad_request`), or, with the `x-maviapi-strict: 1` request header, a query param the operation does not take was sent (`unknown_param`, with the names in `params`). |
| 401 | `missing_api_key` | No API key was sent, or the key is invalid or revoked (`missing_api_key`, `invalid_api_key`). |
| 402 | `credit_limit_reached` | The plan's credits for this period are used up. |
| 403 | `account_banned` | The account that owns the key is suspended. |
| 410 | `cursor_expired` | The stored copy of the list this cursor walks is gone. Start the list again without cursor. |
| 429 | `rate_limited` | Too many requests for this key (`rate_limited`), or too many at once for its plan (`concurrency_limited`). Wait the number of seconds in `Retry-After`. |
| 502 | `scrape_failed` | The source site could not be read this time. Retrying later usually works. |

## Endpoint reference

Base URL: `https://api.maviapi.com/v1/sites/kiwi`. API version 2026-11-27. The same contract is in [`openapi.json`](openapi.json).

### `GET /airports-near`

Airports within a radius of a point, nearest first, with distance, city, country, time zone and Kiwi popularity.

Each successful request uses 5 credits.

Methods: `airports_near` (Python, Ruby) · `airportsNear` (JavaScript/TypeScript, PHP, Java) · `AirportsNear` (Go) · `AirportsNearAsync` (C#)

Parameters:

- `lat` (number, optional): latitude of the point, decimal degrees. Example: `51.5`.
- `lon` (number, optional): longitude of the point, decimal degrees. Example: `-0.12`.
- `radius_km` (number, optional): search radius in km (default 150, max 500). Example: `150`.
- `include_inactive` (string, optional): "true" also returns airports Kiwi sells no flights from (small airfields, military fields). One of: `false`, `true`. Example: `false`.
- `limit` (integer, optional): Rows in one page, 1 to 50 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "point": {
      "lat": 51.5,
      "lon": -0.12
    },
    "radius_km": 150,
    "include_inactive": false,
    "total": 8,
    "cap": 50,
    "capped": false,
    "airports": [
      {
        "code": "LCY",
        "id": "LCY",
        "search_id": "Airport:LCY",
        "icao": "EGLC",
        "name": "London City",
        "city": {
          "id": "london_gb",
          "name": "London"
        },
        "country": {
          "code": "GB",
          "name": "United Kingdom"
        },
        "timezone": "Europe/London",
        "coordinates": {
          "lat": 51.505,
          "lon": 0.054167
        },
        "distance_km": 12.1,
        "popularity": 300276,
        "global_rank": 165,
        "active": true
      }
    ],
    "pagination": {
      "count": 8,
      "has_more": false,
      "next_cursor": null
    },
    "fetched_at": "2026-11-27T17:57:11.839Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /explore`

The cheapest flight to every destination city from a place, like kiwi.com's 'anywhere' search: one row per city with price, origin and destination airports, local and UTC times and, for round trips, nights and return date. expand attaches the top 3 full itineraries for the first N cities.

Each successful request uses 5 credits.

Methods: `explore` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Explore` (Go) · `ExploreAsync` (C#)

Parameters:

- `from` (string, optional): origin. A 3-letter upper-case code is an airport (else a metro city code such as LON), an upper-case 2-letter code a country (else a continent such as EU); otherwise a name of any place type, case and accent insensitive, or a search id from /places-v2 (Airport:CRL, Country:TR). Unclear or unknown values answer 400 with candidates. Example: `London`.
- `to` (string, optional): optional broad scope for the destinations: a country, subdivision, region or continent (code, name or search id); 'anywhere' for every destination. Example: `anywhere`.
- `date_from` (string, optional): start of the departure window, YYYY-MM-DD; defaults to 30 days from today.
- `date_to` (string, optional): end of the departure window, YYYY-MM-DD, inclusive; defaults to date_from.
- `return_from` (string, optional): start of the return window, YYYY-MM-DD; set it for a round trip, omit for one-way.
- `return_to` (string, optional): end of the return window, YYYY-MM-DD, inclusive; defaults to return_from.
- `min_price` (string, optional): lowest price per destination, in currency.
- `max_price` (string, optional): highest price per destination, in currency.
- `max_stops` (string, optional): most stops per leg (0 = direct only); omit for any.
- `adults` (integer, optional): adult passengers (1-9). Example: `1`.
- `children` (integer, optional): child passengers (0-8). Example: `0`.
- `infants` (integer, optional): infant passengers, at most one per adult. Example: `0`.
- `sort` (string, optional): which flight represents each city and the order of the cities: PRICE (cheapest first), POPULARITY (kiwi.com's popular destinations first), QUALITY, DURATION or DATE. The set of cities differs a little per sort. One of: `PRICE`, `POPULARITY`, `QUALITY`, `DURATION`, `DATE`. Example: `PRICE`.
- `currency` (string, optional): price currency, 3-letter ISO code; min_price and max_price use it too. Example: `eur`.
- `expand` (integer, optional): attach the top 3 itineraries (segments, airlines, booking link) to the destinations ranked 1 to N; 0 = none. Example: `0`.
- `limit` (integer, optional): Rows in one page, 1 to 1000 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "search": {
      "from": {
        "input": "London",
        "id": "City:london_gb",
        "name": "London",
        "type": "city",
        "code": "LON",
        "country": "GB",
        "matched_by": "name",
        "alternatives": [
          {
            "id": "City:london_on_ca",
            "name": "London",
            "type": "city",
            "code": "YXU",
            "parent": "Canada"
          }
        ]
      },
      "to": {
        "input": "anywhere",
        "id": null,
        "name": "Anywhere",
        "type": "anywhere",
        "code": null,
        "country": null,
        "matched_by": "anywhere",
        "alternatives": [
          null
        ]
      },
      "date_from": "2026-12-27",
      "date_to": "2026-12-27",
      "return_from": null,
      "return_to": null,
      "trip_type": "oneway",
      "min_price": null,
      "max_price": null,
      "max_stops": null,
      "passengers": {
        "adults": 1,
        "children": 0,
        "infants": 0
      },
      "sort": "PRICE",
      "currency": "EUR",
      "expand": 0
    },
    "total": 87,
    "cap": 1000,
    "count": 87,
    "destinations": [
      {
        "rank": 1,
        "city": "Milan",
        "city_id": "milan_it",
        "search_id": "City:milan_it",
        "country": {
          "code": "IT",
          "name": "Italy"
        },
        "airport": "Milan–Malpensa",
        "airport_code": "MXP",
        "price": {
          "amount": 20,
          "currency": "EUR"
        },
        "price_eur": 20,
        "origin": {
          "airport": "London Stansted",
          "code": "STN",
          "city": "London",
          "city_id": "london_gb",
          "country": {
            "code": "GB",
            "name": "United Kingdom"
          }
        },
        "departure": {
          "local_time": "2026-12-27T06:25:00+00:00",
          "utc_time": "2026-12-27T06:25:00Z"
        },
        "arrival": {
          "local_time": "2026-12-27T09:20:00+01:00",
          "utc_time": "2026-12-27T08:20:00Z"
        },
        "nights": null,
        "return_departure": null
      }
    ],
    "pagination": {
      "count": 87,
      "has_more": false,
      "next_cursor": null
    },
    "fetched_at": "2026-11-27T17:57:14.990Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /explore-v2`

The cheapest flight to every destination city from a place, like kiwi.com's 'anywhere' search, with that flight on every row: airlines, stops, duration, local and UTC departure and arrival, segments and booking link (and the return leg for round trips). Same filters and destination fields as /explore; at most the first 200 cities.

Each successful request uses 5 credits.

Methods: `explore_v2` (Python, Ruby) · `exploreV2` (JavaScript/TypeScript, PHP, Java) · `ExploreV2` (Go) · `ExploreV2Async` (C#)

Parameters:

- `from` (string, optional): origin. A 3-letter upper-case code is an airport (else a metro city code such as LON), an upper-case 2-letter code a country (else a continent such as EU); otherwise a name of any place type, case and accent insensitive, or a search id from /places-v2. Unclear or unknown values answer 400 with candidates. Example: `London`.
- `to` (string, optional): optional broad scope for the destinations: a country, subdivision, region or continent (code, name or search id); 'anywhere' for every destination. Example: `anywhere`.
- `date_from` (string, optional): start of the departure window, YYYY-MM-DD; defaults to 30 days from today.
- `date_to` (string, optional): end of the departure window, YYYY-MM-DD, inclusive; defaults to date_from.
- `return_from` (string, optional): start of the return window, YYYY-MM-DD; set it for a round trip, omit for one-way.
- `return_to` (string, optional): end of the return window, YYYY-MM-DD, inclusive; defaults to return_from.
- `min_price` (string, optional): lowest price per destination, in currency.
- `max_price` (string, optional): highest price per destination, in currency.
- `max_stops` (string, optional): most stops per leg (0 = direct only); omit for any.
- `adults` (integer, optional): adult passengers (1-9). Example: `1`.
- `children` (integer, optional): child passengers (0-8). Example: `0`.
- `infants` (integer, optional): infant passengers, at most one per adult. Example: `0`.
- `sort` (string, optional): order of the cities (and which flight sets the destination price): PRICE (cheapest first), POPULARITY, QUALITY, DURATION or DATE. The flight on each row is that city's cheapest itinerary. One of: `PRICE`, `POPULARITY`, `QUALITY`, `DURATION`, `DATE`. Example: `PRICE`.
- `currency` (string, optional): price currency, 3-letter ISO code; min_price and max_price use it too. Example: `eur`.
- `limit` (integer, optional): Rows in one page, 1 to 200 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "search": {
      "from": {
        "input": "London",
        "id": "City:london_gb",
        "name": "London",
        "type": "city",
        "code": "LON",
        "country": "GB",
        "matched_by": "name",
        "alternatives": [
          {
            "id": "City:london_on_ca",
            "name": "London",
            "type": "city",
            "code": "YXU",
            "parent": "Canada"
          }
        ]
      },
      "to": {
        "input": "anywhere",
        "id": null,
        "name": "Anywhere",
        "type": "anywhere",
        "code": null,
        "country": null,
        "matched_by": "anywhere",
        "alternatives": [
          null
        ]
      },
      "date_from": "2026-12-27",
      "date_to": "2026-12-27",
      "return_from": null,
      "return_to": null,
      "trip_type": "oneway",
      "min_price": null,
      "max_price": null,
      "max_stops": null,
      "passengers": {
        "adults": 1,
        "children": 0,
        "infants": 0
      },
      "sort": "PRICE",
      "currency": "EUR"
    },
    "total": 87,
    "cap": 1000,
    "count": 87,
    "with_flight": 87,
    "lookups_failed": 0,
    "destinations": [
      {
        "rank": 1,
        "city": "Milan",
        "city_id": "milan_it",
        "search_id": "City:milan_it",
        "country": {
          "code": "IT",
          "name": "Italy"
        },
        "airport": "Milan–Malpensa",
        "airport_code": "MXP",
        "price": {
          "amount": 20,
          "currency": "EUR"
        },
        "price_eur": 20,
        "origin": {
          "airport": "London Stansted",
          "code": "STN",
          "city": "London",
          "city_id": "london_gb",
          "country": {
            "code": "GB",
            "name": "United Kingdom"
          }
        },
        "departure": {
          "local_time": "2026-12-27T06:25:00+00:00",
          "utc_time": "2026-12-27T06:25:00Z"
        },
        "arrival": {
          "local_time": "2026-12-27T09:20:00+01:00",
          "utc_time": "2026-12-27T08:20:00Z"
        },
        "nights": null,
        "return_departure": null,
        "flight": {
          "id": "ItineraryOneWay:eyJwcm92aWRlcnMiOiJLSVdJLUJBU0lDOktJV0kiLCJyb3V0ZV9kYXRhIjoiRlI6ODcxOTpTVE46MTc5ODM1MjcwMDpNWFA6MTc5ODM1OTYwMDplY29ub215OkZhbHNlOjo6IiwicHJpY2UiOiIyMCJ9",
          "price": {
            "amount": 20,
            "currency": "EUR"
          },
          "price_eur": 20,
          "airlines": [
            {
              "code": "FR",
              "name": "Ryanair"
            }
          ],
          "stops": 0,
          "duration_minutes": 115,
          "departure": {
            "local_time": "2026-12-27T06:25:00+00:00",
            "utc_time": "2026-12-27T06:25:00Z",
            "airport": "London Stansted",
            "code": "STN"
          },
          "arrival": {
            "local_time": "2026-12-27T09:20:00+01:00",
            "utc_time": "2026-12-27T08:20:00Z",
            "airport": "Milan–Malpensa",
            "code": "MXP"
          },
          "segments": [
            {
              "flight_number": "8719",
              "carrier": {
                "name": "Ryanair",
                "code": "FR"
              },
              "operating_carrier": null,
              "cabin": "ECONOMY",
              "duration_seconds": 6900,
              "from": {
                "airport": "London Stansted",
                "code": "STN",
                "city": "London",
                "country": "United Kingdom",
                "local_time": "2026-12-27T06:25:00+00:00",
                "utc_time": "2026-12-27T06:25:00Z"
              },
              "to": {
                "airport": "Milan–Malpensa",
                "code": "MXP",
                "city": "Milan",
                "country": "Italy",
                "local_time": "2026-12-27T09:20:00+01:00",
                "utc_time": "2026-12-27T08:20:00Z"
              },
              "layover_seconds": null
            }
          ],
          "departure_time": "2026-12-27T06:25:00+00:00",
          "arrival_time": "2026-12-27T09:20:00+01:00",
          "from_airport": "STN",
          "to_airport": "MXP",
          "total_duration_minutes": 115,
          "inbound": null,
          "return": null,
          "provider": "Kiwi.com",
          "booking_url": "https://www.kiwi.com/en/booking/?direct=true&locale=en&currency=eur&passengers=1-0-0&token=Hdi0WjpI6J5NtkYLZVJuVdaFhLXZtMNCjWvaJ-_bXBWJvDQdFmcxcdQ5Ue4vWMFBvvjxZ0mKtemwzrxFuV1-Tqu6wETVYGNqdOyMdhFG_jmPLOfUagsA1AFzDgqrpOqSuAEQsV3ynbdnQb121ZOBKD32-fHCdxz78G5cG_r-07dugONX96YvHkgsj1ODegx0Ar8I3kJ6sR5IWiL5hs-7ameAx6u8kv8xQd-QCUxYJjVSHedZKpDU4KsLoeA1nq4M0ilZm8NewIbQb0xFboOmdOnp1t89HRyVDmJnAUPFz-CKOYGqXK2MpvYHPYjL4VCdEnbSLkIU1aBOaiMMKh6520KVY4e54w5wvVQW54GpfO7OYqtegjhoEw85YCIARsbJQZNHta6SWoZAxqN-vXeSnhxiLsWg8H6Hvx13RqJym-aftuIOptmozeCpUrsfvHH_j0hag3K0KLj4QoDbq1XeK05tQ5C59LEv1ZqOVKSwNxDLEDy3YiWnYv46gIAWHRQLNlwszthnrTYXVN2SN81aLNiZ4I8eO4Zu9TX9934qItvyud1clx1SbpXU4-tBTfmZ3z8HO7R6tvGv-4qRkXAYisY0RJih2JKQmQH9_-iQAJPUBIwj6kNfB_d_MUDGfFHIQOh8dLbGRqpA1rPUJ3rhUJasrT-hXgaD4m4ysT-1h4BfUqy_OO8SmqA9Rtd8nnvdTD2jJlrtJ3jVPrnv1SgmP1o2QBwqBAMHHrRV_eXFes-c559i7gl9z2S2ONqFWt0n4eWAze0u9s9siikCyZ6OlAyvPQe3hiOkvHDo6CNLh4kElIoBUF2DQhFI2-GpVuIJAoth7lbMmSXndN_8hyEZOQqCCIrNNCyrtV6HEcB4YoC4f5UfUtzlcHhbO5U5sQeVocNwZ3whgncQMFRU4Gbbg6e0BwhR4m3WIqdHUdfQVVyxh86e_xpqNLGgMQHog_n72qI6Lv5k1BtHT-4Q-HYxJI2Da3Q9UuFqCu8hJyw8VRMphppSG6ixA2b17GpjyHvi9wnxzt3GnmHoZZSKaAXHf_Wvf7Y49sR4Zmv_Zs0Wgh45Yj1BPXE8JH4-C-31JbVKY3O0n4U8xZ-2qOqG8u25VlYPDO66xvB3-ttKCLS4HpdUjnuA3tSp5e3QedHF38DcK&searchType=oneWay&searchBags=0.0"
        }
      }
    ],
    "pagination": {
      "count": 87,
      "has_more": false,
      "next_cursor": null
    },
    "fetched_at": "2026-11-27T17:57:20.997Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /places`

Kiwi locations of one type matching a name or IATA code, best match first.

Each successful request uses 5 credits.

Methods: `places` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Places` (Go) · `PlacesAsync` (C#)

Parameters:

- `q` (string, optional): search term (place name or IATA code). Example: `paris`.
- `type` (string, optional): location type to search: city, airport, country, region or subdivision. One of: `city`, `airport`, `country`, `region`, `subdivision`. Example: `city`.
- `limit` (integer, optional): Rows in one page, 1 to 200 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "query": "paris",
    "type": "city",
    "count": 6,
    "places": [
      {
        "id": "paris_fr",
        "name": "Paris",
        "code": "PAR",
        "type": "city",
        "slug": "paris-france",
        "city": null,
        "subdivision": "Île-de-France",
        "country": {
          "code": "FR",
          "name": "France"
        },
        "region": "Western Europe",
        "continent": "Europe",
        "timezone": "Europe/Paris",
        "population": 2138551,
        "airports": 4,
        "coordinates": {
          "lat": 48.856614,
          "lon": 2.352222
        }
      }
    ],
    "pagination": {
      "count": 6,
      "has_more": false,
      "next_cursor": null
    },
    "fetched_at": "2026-11-27T17:57:21.261Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /places-v2`

Kiwi locations of every type matching a name or code, best match first; each row has its country and a search_id for the flight searches.

Each successful request uses 5 credits.

Methods: `places_v2` (Python, Ruby) · `placesV2` (JavaScript/TypeScript, PHP, Java) · `PlacesV2` (Go) · `PlacesV2Async` (C#)

Parameters:

- `q` (string, optional): place name or code (case and accent insensitive). Example: `CRL`.
- `type` (string, optional): optional filter, one type or a comma list of city, airport, country, subdivision, region, continent, autonomous_territory, special, tourist_region. Omit for every type.
- `limit` (integer, optional): Rows in one page, 1 to 1000 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "query": "CRL",
    "types": "all",
    "total": 190,
    "cap": 1000,
    "capped": false,
    "count": 190,
    "places": [
      {
        "id": "CRL",
        "search_id": "Airport:CRL",
        "name": "Brussels South Charleroi",
        "code": "CRL",
        "type": "airport",
        "slug": "brussels-south-charleroi-city-of-brussels-belgium",
        "city": {
          "id": "brussels_be",
          "name": "Brussels"
        },
        "subdivision": null,
        "country": {
          "code": "BE",
          "name": "Belgium"
        },
        "region": "Western Europe",
        "continent": "Europe",
        "timezone": "Europe/Brussels",
        "population": null,
        "airports": null,
        "coordinates": {
          "lat": 50.459167,
          "lon": 4.453889
        }
      }
    ],
    "pagination": {
      "count": 190,
      "has_more": false,
      "next_cursor": null
    },
    "fetched_at": "2026-11-27T17:57:21.324Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /places/{id}`

One Kiwi location by id or code: name, type, codes, city, country, region, continent, time zone, population and coordinates.

Each successful request uses 5 credits.

Methods: `places_by_id` (Python, Ruby) · `placesById` (JavaScript/TypeScript, PHP, Java) · `PlacesById` (Go) · `PlacesByIdAsync` (C#)

Parameters:

- `id` (string, required, in the path): a Kiwi location id: an airport code (CRL), a city id (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe), or a search id (Airport:CRL, City:london_gb). Example: `CRL`.
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "id": "CRL",
    "search_id": "Airport:CRL",
    "name": "Brussels South Charleroi",
    "code": "CRL",
    "type": "airport",
    "slug": "brussels-south-charleroi-city-of-brussels-belgium",
    "city": {
      "id": "brussels_be",
      "name": "Brussels"
    },
    "subdivision": null,
    "country": {
      "code": "BE",
      "name": "Belgium"
    },
    "region": "Western Europe",
    "continent": "Europe",
    "timezone": "Europe/Brussels",
    "population": null,
    "airports": null,
    "coordinates": {
      "lat": 50.459167,
      "lon": 4.453889
    },
    "fetched_at": "2026-11-27T17:57:21.052Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /revalidate`

Checks one itinerary from /search, /search-v2 or /search-v3 again before booking: whether the same flights are still on sale, their current total price for these passengers and currency, a fresh booking link and segments, fetched_at and expires_at. Never cached.

Each successful request uses 5 credits.

Methods: `revalidate` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Revalidate` (Go) · `RevalidateAsync` (C#)

Parameters:

- `id` (string, optional): the itinerary id (`id`) of a search row, one-way or return.
- `currency` (string, optional): price currency, 3-letter ISO code; pass the currency of the original search to compare with quoted_price. Example: `eur`.
- `adults` (integer, optional): adult passengers (1-9). Example: `1`.
- `children` (integer, optional): child passengers (0-8). Example: `0`.
- `infants` (integer, optional): infant passengers, at most one per adult. Example: `0`.
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "id": "ItineraryOneWay:eyJwcm92aWRlcnMiOiJLSVdJLUJBU0lDOktJV0kiLCJyb3V0ZV9kYXRhIjoiVlk6MTA3NzpCUlU6MTc5ODM2MjYwMDpCQ046MTc5ODM3MDEwMDplY29ub215OkZhbHNlOjo6VlkiLCJwcmljZSI6IjE2NyJ9",
    "type": "oneway",
    "quoted_price": 167,
    "passengers": {
      "adults": 1,
      "children": 0,
      "infants": 0
    },
    "currency": "EUR",
    "available": true,
    "status": "available",
    "current_id": "ItineraryOneWay:eyJwcm92aWRlcnMiOiJLSVdJLUJBU0lDOktJV0kiLCJyb3V0ZV9kYXRhIjoiVlk6MTA3NzpCUlU6MTc5ODM2MjYwMDpCQ046MTc5ODM3MDEwMDplY29ub215OkZhbHNlOjo6VlkiLCJwcmljZSI6IjE2NyJ9",
    "price": {
      "amount": 167,
      "currency": "EUR"
    },
    "price_eur": 167,
    "price_changed": false,
    "price_change": 0,
    "booking_url": "https://www.kiwi.com/en/booking/?direct=true&locale=en&currency=eur&passengers=1-0-0&token=HhAwI_v77loZKn-bVc6varhgzBjVyg7ywAn7GXavLRMpPwfd9YD-mJmEokSLBXJlTw2U_TfBJp3_uuejS1GNJobE7PC_ZWguWpF-0DLwktmAxV2lW0vtZUwtoFAmGy6nbpFjlGhHAACDuQ9q50fgK4bNubtfHd-e4sUFtTORWXoSPKwijjD1Ffo0jpuqHHocIB32VuJsNY1JaRQ0Z98G8X2AFa8VjpyxC5wp0b8TkZANKPJO_Sl3trE_p8yV90uMZteVvT0xBQ4cS2I55_4Z3kPYb1-TkXJl1v-Iexfj_wk0MgCR0lxfCS0i64Dn926Dq6w7_VTAcV1QqZxXve35Q_2-8Vdefd2LDQTpsvM3uk07Bx-_0biPVnKsBFrZC3Ff7hmfZsX6rP_J9vrFD0QlPH7bM4qIzSq4OWpJP8qVj8Bo5AlPknVRXpONWch3UoJ6t4CMv7D1k9icyORbzS6QSkkRvsp9wkE3UuuUTdu5kby1yjB4sRD1l1zu0Xl4RzHVUvKGl9ujLpLR1-rS8TPeVKXZfQ25IjGClu0y8WVfxLS8MAOd7fbZH1EYJAXntzEeuvgIEu-6gE6conflUymssyzYKyIx9gibOgUcjhQ4gY5ZJTRJx8E80N-4S6L8VLUq8BP3rCmLvspseo8ZDnC37YCD0kPCQklnV4M-3Bp2wP7qnblLQ36b2XGZ9kuxNOy8dVSHg6n8B3osQLRxQcYXyWOnhnsv0IyHmh73UwuXoq9BDwZpoWUhaZdMqxSkH4p3gpjwGvWKDn5GSUE_21tVvfbgVzyiDDgsj_0tDvh1zJ587DvlDZPlrVPm4NYa9moAuS9qS-3Qw3UM9dljKhmW2WCcdFdql1qZbHEcjrFde66uxmYBLTTJtMB98xJAHLykDVHGlwxT0cAWIQgfLd5puHD1eBbWMF5vScBbcGF7M--Ht2fTsrNAsNCR3SP-s5dAqlDafftw4X-49oXkW7EGwxDLcaeviN8eGidd__F-F96GOJ5z7zM6GRskfMPXZoo81SwTI_qrgtbnNBaNvPaXUm5XpWLI4tVrvsDf9WT38XoTc0-2KT8c-khd8bEgqnLXbdeyeon4lrJmgllgBmmd1zTReVmtXIHJUa5CLdObETwg%3D&searchType=oneWay&searchBags=0.0",
    "provider": "Kiwi.com",
    "duration_seconds": 7500,
    "outbound": {
      "duration_seconds": 7500,
      "stops": 0,
      "segments": [
        {
          "flight_number": "1077",
          "carrier": {
            "name": "Vueling",
            "code": "VY"
          },
          "operating_carrier": {
            "name": "Vueling",
            "code": "VY"
          },
          "cabin": "ECONOMY",
          "duration_seconds": 7500,
          "from": {
            "airport": "Brussels",
            "code": "BRU",
            "city": "Brussels",
            "country": "Belgium",
            "local_time": "2026-12-27T10:10:00+01:00",
            "utc_time": "2026-12-27T09:10:00Z",
            "time": "2026-12-27T10:10:00+01:00"
          },
          "to": {
            "airport": "Barcelona–El Prat",
            "code": "BCN",
            "city": "Barcelona",
            "country": "Spain",
            "local_time": "2026-12-27T12:15:00+01:00",
            "utc_time": "2026-12-27T11:15:00Z",
            "time": "2026-12-27T12:15:00+01:00"
          },
          "layover_seconds": null
        }
      ],
      "from": {
        "airport": "Brussels",
        "code": "BRU",
        "city": "Brussels",
        "country": "Belgium",
        "local_time": "2026-12-27T10:10:00+01:00",
        "utc_time": "2026-12-27T09:10:00Z",
        "time": "2026-12-27T10:10:00+01:00"
      },
      "to": {
        "airport": "Barcelona–El Prat",
        "code": "BCN",
        "city": "Barcelona",
        "country": "Spain",
        "local_time": "2026-12-27T12:15:00+01:00",
        "utc_time": "2026-12-27T11:15:00Z",
        "time": "2026-12-27T12:15:00+01:00"
      }
    },
    "inbound": null,
    "fetched_at": "2026-11-27T17:57:22+00:00",
    "expires_at": "2026-11-27T18:27:22+00:00"
  },
  "cached": null,
  "source": null,
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /routes`

Published city-pair routes (cheap-flights pages) from one of Kiwi's route sitemaps, in sitemap order.

Each successful request uses 5 credits.

Methods: `routes` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Routes` (Go) · `RoutesAsync` (C#)

Parameters:

- `page` (integer, optional): which route sitemap to read, 0-based; Kiwi splits about 50k routes per file across many files. Example: `0`.
- `limit` (integer, optional): Rows in one page, 1 to 200 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "page": 0,
    "sitemap": "https://www.kiwi.com/odcf/routes/sitemap/0.xml",
    "count": 49949,
    "routes": [
      {
        "url": "https://www.kiwi.com/en/cheap-flights/london-united-kingdom/istanbul-turkey/",
        "locale": "en",
        "source": {
          "slug": "london-united-kingdom",
          "name": "London United Kingdom"
        },
        "destination": {
          "slug": "istanbul-turkey",
          "name": "Istanbul Turkey"
        }
      }
    ],
    "pagination": {
      "count": 49949,
      "has_more": true,
      "next_cursor": "WzEsIjBkMTJiNGY3IixudWxsLDAseyJwYWdlIjoxfV0"
    },
    "fetched_at": "2026-11-27T17:57:24.241Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /search`

Flight itineraries for one departure day (and optional return day): prices, airlines, segments, local and UTC times and booking links, as kiwi.com ranks them (at most 25 per search).

Each successful request uses 5 credits.

Methods: `search` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Search` (Go) · `SearchAsync` (C#)

Parameters:

- `from` (string, optional): origin: place name, IATA code or Kiwi id (london, LHR, City:london_gb). Example: `london`.
- `to` (string, optional): destination: place name, IATA code or Kiwi id. Example: `istanbul`.
- `date` (string, optional): outbound departure date, YYYY-MM-DD; defaults to 30 days from today. A past date gives an empty list.
- `return_date` (string, optional): inbound departure date, YYYY-MM-DD; set it for a round trip, omit for one-way.
- `adults` (integer, optional): adult passengers (1-9). Example: `1`.
- `children` (integer, optional): child passengers (0-9). Example: `0`.
- `infants` (integer, optional): infant passengers (0-9, at most one per adult). Example: `0`.
- `cabin` (string, optional): cabin class. One of: `ECONOMY`, `PREMIUM_ECONOMY`, `BUSINESS`, `FIRST`. Example: `ECONOMY`.
- `sort` (string, optional): result ordering: QUALITY, PRICE or DURATION. One of: `QUALITY`, `PRICE`, `DURATION`. Example: `QUALITY`.
- `currency` (string, optional): price currency (ISO code). Example: `eur`.
- `limit` (integer, optional): Rows in one page, 1 to 200 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "search": {
      "from": {
        "input": "london",
        "id": "City:london_gb",
        "name": "London",
        "code": "LON"
      },
      "to": {
        "input": "istanbul",
        "id": "City:istanbul_tr",
        "name": "Istanbul",
        "code": "IST"
      },
      "date": "2026-12-27",
      "return_date": null,
      "trip_type": "oneway",
      "passengers": {
        "adults": 1,
        "children": 0,
        "infants": 0
      },
      "cabin": "ECONOMY",
      "sort": "QUALITY",
      "currency": "EUR"
    },
    "total": 25,
    "count": 25,
    "itineraries": [
      {
        "id": "ItineraryOneWay:eyJwcm92aWRlcnMiOiJLSVdJLUJBU0lDOktJV0kiLCJyb3V0ZV9kYXRhIjoiVkY6MTk5MDpTVE46MTc5ODM4NjAwMDpTQVc6MTc5ODQwMDEwMDplY29ub215OkZhbHNlOjo6VkYiLCJwcmljZSI6IjExOCJ9",
        "type": "oneway",
        "price": {
          "amount": 118,
          "currency": "EUR"
        },
        "price_eur": 118,
        "duration_seconds": 14100,
        "provider": "Kiwi.com",
        "booking_url": "https://www.kiwi.com/en/booking/?direct=true&locale=en&currency=eur&passengers=1-0-0&token=HA4-FnJWszIzt3_rKlYLhY1BKbwyV2_TY5aMM7Bgxq7OtWpca5XaUs5hxSGvlg8EEJNDcrOpPHfD23K-oqZ8NnLPx3nd7QuvrncJTyEp2WEluP7zfQ-7sutHlAcPjcL6Qbrc2O_Ih6LlFqB31lw9RZbpUjyYlubn0-T2a2bznfLaNJW_5bWtjveFSSisO-30dPEdA3CeGYRPLOd0O6PNFPZUEzWeoH3wM4e_lr2ec6A2pBlEzUOxUcL_6J8-hs32D1UxPitumY2RHHvGjyjmMCMfnmkN3ZOSaLh-j92D2yooM3vJW_uXR0VBpWDby4iZEmBHP7yKXq7fgrV1jjK3Gz7EXKz8cxflYQDMVLSh7ugvtsRqv2v3IkqeudiTzvsdOn0jXO3-n9oznjadBXL9PEseVBPpWJjYdqBxHZjlg_pzSj9_gOqX5bfX5v9D72S2ffMm5aXsyCsgGnhhZt3I9UlqDCUz9EabkWx153JyHwUWoZMYw3T6JK2OA2NNiPkhTenzNIXbgOyfwG7DLkZxGkm_D3Jzix05WSGB74ydT_y2M7ineIclpqshi11DHroqXx2hiu1wkzHm6W_CB6gChetehhK7b5OzP_zC5W_y4TNCpfUUp3hqvQa6JUa0o5UfbD43ExlMBMcXc-DMqZq28xIUeTRvZkHxZs-uE2BwdqMgPPgPM3Ky9Zt6q9jDulQoCCHmhiHgdIG9LGMYaH9aB9FUZuULdgPgep6bLBx2F5Qx0YLTUb5en5xx4QCpSc7qM2TYDwTYHQ9MwibSt658lUHxRKoISGWz6qXzrPltbKgvZWGEJJrMmsg5CdCMG-BVd_6RiISJbYOWNciEpM0fCCxn9-KW79zS1eKNl96JBV1YGyg_mGtfxA34Ea0QEy14XvGznZjPUOQyZ5dkwRt7U7GgVPs17MKV5V3_d7FErFAQHcrZQ_R_4OtJrGe0KCoX7watxE0jfhLKRIZHgNOHfXVBzxlymG-ntblANaPJQWUBKBcon-d5fvM6SFTBY4o4MR9vzQdq39v41B-RtzOCqvcXVmhz_h1K8URMhWgUyijVhu7prreIuTGhNx1UmNxJO2Fa4cpU9t9Az0Za0zfn29sL5RnOkicqh3Q2SaaBTeh0%3D&searchType=oneWay&searchBags=0.0",
        "outbound": {
          "duration_seconds": 14100,
          "stops": 0,
          "segments": [
            {
              "flight_number": "1990",
              "carrier": {
                "name": "AJet",
                "code": "VF"
              },
              "operating_carrier": {
                "name": "AJet",
                "code": "VF"
              },
              "cabin": "ECONOMY",
              "duration_seconds": 14100,
              "from": {
                "airport": "London Stansted",
                "code": "STN",
                "city": "London",
                "country": "United Kingdom",
                "local_time": "2026-12-27T15:40:00+00:00",
                "utc_time": "2026-12-27T15:40:00Z"
              },
              "to": {
                "airport": "Sabiha Gökçen International",
                "code": "SAW",
                "city": "Istanbul",
                "country": "Turkey",
                "local_time": "2026-12-27T22:35:00+03:00",
                "utc_time": "2026-12-27T19:35:00Z"
              },
              "layover_seconds": null
            }
          ],
          "from": {
            "airport": "London Stansted",
            "code": "STN",
            "city": "London",
            "country": "United Kingdom",
            "local_time": "2026-12-27T15:40:00+00:00",
            "utc_time": "2026-12-27T15:40:00Z"
          },
          "to": {
            "airport": "Sabiha Gökçen International",
            "code": "SAW",
            "city": "Istanbul",
            "country": "Turkey",
            "local_time": "2026-12-27T22:35:00+03:00",
            "utc_time": "2026-12-27T19:35:00Z"
          },
          "airlines": [
            "VF"
          ]
        },
        "inbound": null
      }
    ],
    "pagination": {
      "count": 25,
      "has_more": false,
      "next_cursor": null
    },
    "fetched_at": "2026-11-27T17:57:24.922Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /search-v2`

Flight itineraries for departure (and optional return) date windows, with prices, segments, airlines, local and UTC times and booking links. The list holds at most cap (50) itineraries, in the order of sort; capped is true when kiwi.com had more for the search than were returned, so narrow the search (dates, places, price, stops) to see the rest.

Each successful request uses 5 credits.

Methods: `search_v2` (Python, Ruby) · `searchV2` (JavaScript/TypeScript, PHP, Java) · `SearchV2` (Go) · `SearchV2Async` (C#)

Parameters:

- `from` (string, optional): origin. A 3-letter upper-case code is an airport, searched together with the other airports of its metro area as kiwi.com does (IST also finds SAW), else a metro city code such as LON; an upper-case 2-letter code a country (else a continent such as EU); otherwise a name of any place type (city, airport, subdivision, country, region, continent), case and accent insensitive, or a search id from /places-v2 (Airport:CRL, Country:TR). Unclear or unknown values answer 400 with candidates. Example: `CRL`.
- `to` (string, optional): destination, same rules as from, plus 'anywhere'. Example: `Europe`.
- `date_from` (string, optional): start of the departure window, YYYY-MM-DD; defaults to 30 days from today.
- `date_to` (string, optional): end of the departure window, YYYY-MM-DD, inclusive; defaults to date_from.
- `return_from` (string, optional): start of the return window, YYYY-MM-DD; set it for a round trip, omit for one-way.
- `return_to` (string, optional): end of the return window, YYYY-MM-DD, inclusive; defaults to return_from.
- `min_price` (string, optional): lowest total price, in currency.
- `max_price` (string, optional): highest total price, in currency.
- `max_stops` (string, optional): most stops per leg (0 = direct only); omit for any.
- `adults` (integer, optional): adult passengers (1-9). Example: `1`.
- `children` (integer, optional): child passengers (0-8). Example: `0`.
- `infants` (integer, optional): infant passengers, at most one per adult. Example: `0`.
- `cabin` (string, optional): cabin class. One of: `ECONOMY`, `PREMIUM_ECONOMY`, `BUSINESS`, `FIRST`. Example: `ECONOMY`.
- `sort` (string, optional): order of the list: QUALITY (kiwi.com's best first, then the rest of what it has), PRICE (cheapest first) or DURATION (shortest first). One of: `QUALITY`, `PRICE`, `DURATION`. Example: `QUALITY`.
- `currency` (string, optional): price currency, 3-letter ISO code; min_price and max_price use it too. Example: `eur`.
- `limit` (integer, optional): Rows in one page, 1 to 200 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "search": {
      "from": {
        "input": "CRL",
        "id": "Airport:CRL",
        "name": "Brussels South Charleroi",
        "type": "airport",
        "code": "CRL",
        "country": "BE",
        "matched_by": "code",
        "alternatives": [
          null
        ]
      },
      "to": {
        "input": "Europe",
        "id": "Continent:europe",
        "name": "Europe",
        "type": "continent",
        "code": "EU",
        "country": null,
        "matched_by": "name",
        "alternatives": [
          null
        ]
      },
      "date_from": "2026-12-27",
      "date_to": "2026-12-27",
      "return_from": null,
      "return_to": null,
      "trip_type": "oneway",
      "min_price": null,
      "max_price": null,
      "max_stops": null,
      "passengers": {
        "adults": 1,
        "children": 0,
        "infants": 0
      },
      "cabin": "ECONOMY",
      "sort": "QUALITY",
      "currency": "EUR"
    },
    "total": 50,
    "cap": 50,
    "capped": true,
    "count": 50,
    "itineraries": [
      {
        "id": "ItineraryOneWay:eyJwcm92aWRlcnMiOiJLSVdJLUJBU0lDOktJV0kiLCJyb3V0ZV9kYXRhIjoiRlI6NTkyNjpDUkw6MTc5ODQwMDcwMDpaQUc6MTc5ODQwNzMwMDplY29ub215OkZhbHNlOjo6TFciLCJwcmljZSI6IjI2In0=",
        "type": "oneway",
        "price": {
          "amount": 26,
          "currency": "EUR"
        },
        "price_eur": 26,
        "duration_seconds": 6600,
        "provider": "Kiwi.com",
        "booking_url": "https://www.kiwi.com/en/booking/?direct=true&locale=en&currency=eur&passengers=1-0-0&token=H8HqA0KFUpfwlJz3HUDqkzIB5cuzRce4bgloS0_X3p92dFMTf32b892SLEOFQ1YNN3Mkf8LQw6wCWy4CF9xn4DSqkAQPInQh18n3ty2WgVpAEqVg0SjNuPnmDXgRFR13vqsAoyixfC9VGgysrJrew4LMzArhlqmfe2dDB0lpq6t3DkPL096lN-w7RtI4OAqrnxUFAqWaxjPkxW4w8mSPz5Z9xAnkLrx1pqMYS7elfvqgTRtV7gSIrju1dYhdjVTwTgyBpj0PkLJ8xPbp5B684EoNBtrmUcoIlehJKIERV0xMvv1Im5Q9MK-2B14AN8MRzSlnV82FM_9d0ipvXCd6ydJ3Xs6ZiMqoL6gExJseHL5rp1_o57d4iZbuMN_uijVYgI8T6W6QUTH-HQVzFyxqeV2eiMiSS9ziQR3kG4Z6FPzV3Y4JmgqM2JBBKZAdQh76Wj9Cyt3jvma2KpQfKkZkKEEDuawIWFFm24_W-dovDd1arA3lwDrHXXkgx7My0io3EYNn8hNT4uNMjFDawfdVyd6M_VREhvhCTI7kd0_bHpokq-lEs2nYkrMxEvcjnS5pQIzjblk2SX4dV_W3DyK_9o634mNdO-sFcmaszfRYsfKwszApPofqg2uZ-F6mEs-D-dsPi-GisD3ALqKJMsW0n4o8kjvU8Ykd9yMdmc8pxrlA--_vQu9NMtLiD65AQGPEDIt8804EGN0P2zLqai5OPppvYCu1v-_UCjexJ6g2GzlNrldQ11Nqt3a6JoiU7_KhWUKncOuf7AHL2DenbtYWo_h8k5OjlJ3oQAuo3dZ6Xfjm406X59a9U1Dv6VIGL-QDWDWkrakS3afnc4m6tw863hHUvDS94dOlVTbhhruUm4u2IxMBqzKlHowYBvDuy0p7ALxBzGOLbVsMoehyriXC9iS2Iajw8jbLr0CWvU1dXOGkx2Cpdaxml_yAZ77BFom842eVQrECC5iIjckpVDiY6nKdcSoCG9zJbMRLtokiuOw96_J8abzzRkOWnsGAXCJ-UxhyEwajNRVWehYVGiZpbDc2OZ4C1-F64IjnK2V_QqjOdihXiS_T_6b6x9-gNAiTYvLJAiG1weFLjcg6vIVeCXS8RZDh6YHKDVKjDr71jb6KKp1kCj9CqW7yuDOYDvbXT&searchType=oneWay&searchBags=0.0",
        "outbound": {
          "duration_seconds": 6600,
          "stops": 0,
          "segments": [
            {
              "flight_number": "5926",
              "carrier": {
                "name": "Ryanair",
                "code": "FR"
              },
              "operating_carrier": {
                "name": "Lauda Europe",
                "code": "LW"
              },
              "cabin": "ECONOMY",
              "duration_seconds": 6600,
              "from": {
                "airport": "Brussels South Charleroi",
                "code": "CRL",
                "city": "Brussels",
                "country": "Belgium",
                "local_time": "2026-12-27T20:45:00+01:00",
                "utc_time": "2026-12-27T19:45:00Z"
              },
              "to": {
                "airport": "Zagreb",
                "code": "ZAG",
                "city": "Zagreb",
                "country": "Croatia",
                "local_time": "2026-12-27T22:35:00+01:00",
                "utc_time": "2026-12-27T21:35:00Z"
              },
              "layover_seconds": null
            }
          ],
          "from": {
            "airport": "Brussels South Charleroi",
            "code": "CRL",
            "city": "Brussels",
            "country": "Belgium",
            "local_time": "2026-12-27T20:45:00+01:00",
            "utc_time": "2026-12-27T19:45:00Z"
          },
          "to": {
            "airport": "Zagreb",
            "code": "ZAG",
            "city": "Zagreb",
            "country": "Croatia",
            "local_time": "2026-12-27T22:35:00+01:00",
            "utc_time": "2026-12-27T21:35:00Z"
          },
          "airlines": [
            "FR"
          ]
        },
        "inbound": null
      }
    ],
    "pagination": {
      "count": 50,
      "has_more": false,
      "next_cursor": null
    },
    "fetched_at": "2026-11-27T17:58:40.716Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

### `GET /search-v3`

Every itinerary kiwi.com has for up to 3 origins and 3 destinations over departure (and return) date windows, with local departure and arrival time windows. Each itinerary names the origin and destination it matched (origin, destination), its fetch time and when its quoted price expires; total_estimate counts them and total_exact says whether none of the underlying searches was cut off.

Each successful request uses 5 credits.

Methods: `search_v3` (Python, Ruby) · `searchV3` (JavaScript/TypeScript, PHP, Java) · `SearchV3` (Go) · `SearchV3Async` (C#)

Parameters:

- `from` (string, optional): origin: one place or a comma list of up to 3 (BRU,CRL or LON,STN). Each item: a 3-letter upper-case code is an airport (else a metro city code such as LON), an upper-case 2-letter code a country (else a continent); otherwise a name of any place type, case and accent insensitive, or a search id from /places-v2 (Airport:CRL). Names containing a comma need their search id. Unclear items answer 400 with candidates. Example: `BRU,CRL`.
- `to` (string, optional): destination: one place or a comma list of up to 3, same rules, or 'anywhere' alone. Example: `BCN`.
- `date_from` (string, optional): start of the departure window, YYYY-MM-DD; defaults to 30 days from today.
- `date_to` (string, optional): end of the departure window, YYYY-MM-DD, inclusive, at most 92 days after date_from; defaults to date_from.
- `return_from` (string, optional): start of the return window, YYYY-MM-DD; set it for a round trip, omit for one-way.
- `return_to` (string, optional): end of the return window, YYYY-MM-DD, inclusive; defaults to return_from.
- `departure_from` (string, optional): earliest local departure time of the outbound leg, HH:MM, at the first departure airport.
- `departure_to` (string, optional): latest local departure time of the outbound leg, HH:MM inclusive (up to 24:00). A window cannot cross midnight.
- `arrival_from` (string, optional): earliest local arrival time of the outbound leg, HH:MM, at the final arrival airport.
- `arrival_to` (string, optional): latest local arrival time of the outbound leg, HH:MM inclusive (up to 24:00). A window cannot cross midnight.
- `min_price` (string, optional): lowest total price, in currency.
- `max_price` (string, optional): highest total price, in currency.
- `max_stops` (string, optional): most stops per leg (0 = direct only); omit for any.
- `adults` (integer, optional): adult passengers (1-9). Example: `1`.
- `children` (integer, optional): child passengers (0-8). Example: `0`.
- `infants` (integer, optional): infant passengers, at most one per adult. Example: `0`.
- `cabin` (string, optional): cabin class. One of: `ECONOMY`, `PREMIUM_ECONOMY`, `BUSINESS`, `FIRST`. Example: `ECONOMY`.
- `sort` (string, optional): PRICE or DURATION sort all itineraries; QUALITY keeps kiwi.com's ranking inside each part of the search (the best of each first), then price. One of: `QUALITY`, `PRICE`, `DURATION`. Example: `QUALITY`.
- `currency` (string, optional): price currency, 3-letter ISO code; min_price and max_price use it too. Example: `eur`.
- `limit` (integer, optional): Rows in one page, 1 to 200 (default 50).
- `offset` (integer, optional): Rows to skip before the page starts (default 0).
- `undefined` (string, optional)
- `undefined` (string, optional)
- `undefined` (string, optional)

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "search": {
      "from": [
        {
          "input": "BRU",
          "id": "Airport:BRU",
          "name": "Brussels",
          "type": "airport",
          "code": "BRU",
          "country": "BE",
          "matched_by": "code",
          "alternatives": [
            null
          ]
        }
      ],
      "to": [
        {
          "input": "BCN",
          "id": "Airport:BCN",
          "name": "Barcelona–El Prat",
          "type": "airport",
          "code": "BCN",
          "country": "ES",
          "matched_by": "code",
          "alternatives": [
            null
          ]
        }
      ],
      "date_from": "2026-12-27",
      "date_to": "2026-12-27",
      "return_from": null,
      "return_to": null,
      "trip_type": "oneway",
      "departure_window": null,
      "arrival_window": null,
      "min_price": null,
      "max_price": null,
      "max_stops": null,
      "passengers": {
        "adults": 1,
        "children": 0,
        "infants": 0
      },
      "cabin": "ECONOMY",
      "sort": "QUALITY",
      "currency": "EUR"
    },
    "total_estimate": 86,
    "total_exact": false,
    "upstream_searches": 36,
    "max_upstream_searches": 36,
    "failed_searches": 0,
    "quote_ttl_seconds": 1800,
    "count": 86,
    "itineraries": [
      {
        "id": "ItineraryOneWay:eyJwcm92aWRlcnMiOiJLSVdJLUJBU0lDOktJV0kiLCJyb3V0ZV9kYXRhIjoiVlk6MTA3NzpCUlU6MTc5ODM2MjYwMDpCQ046MTc5ODM3MDEwMDplY29ub215OkZhbHNlOjo6VlkiLCJwcmljZSI6IjE2NyJ9",
        "type": "oneway",
        "price": {
          "amount": 167,
          "currency": "EUR"
        },
        "price_eur": 167,
        "duration_seconds": 7500,
        "provider": "Kiwi.com",
        "booking_url": "https://www.kiwi.com/en/booking/?direct=true&locale=en&currency=eur&passengers=1-0-0&token=HSRgX6wf1RR8q9Bg0MBvEOewA35aK3VViy59Axf_NlIxXj4yxzwNT6ch8aMwtHGGGEnwx479JTaQTGC62GUfrISskQ7BnKQaXom8zNV_9ZNXfxTyKmu2_m2Ovv0wOaiC4IZkxfnexTqC83SgATP3-sTAs4ekVw4ZuwD8EfioRxic1-DDpTSvhQfVA4-OoNn7Qnc95i5OenAruJOss_sPJ66gkpSWLTqzR15P2yPqllHxfzo_TvKFSBTOosnogFWHq7jZsMAz4r3QBGdjRgBiiSmM6u0dUZccmBL_S_YjuEhxCnOcwl-T-7cEe6_hmy7mXUbJISkoXVlLdkI2cND1pcnPp3wewG7lYEYBV3bAd-1oLfn6dpWAOxyYQLb7IH22supBDkgJvlOiTBQNtn-Taz6N65NCyQKQKXsK2LD1F_-OJ3D8dh8bMIaQgt8aO_QuRUGLtqxVgVtn77y71dlV3uOB5J-24i5NwuBlbkNXTF4Fa-cq7JM3xYCQCvOg5DZzD9tmdUMTQ6s18BQXqLVLpV9k2JoacBEG7yqcQwwOcGOf-jqJRSOIfMtK8yBSJ8-vloGFhw0ELlp9kCmVxqZGVcHis9C5DXoEdf6Ck7Yn_ty_nownqmYyxn3bIF3x9FuLWHF9Oaa0HbSaIWtEemg3C7NajD61ZYumpOO4vd8DOSijpOyt7nohwsKXFzs_cOlPnsbfjZh3sfw7DMzMTu_EOq1b3EEcF2T5AcfSAH9ZhhixvgmqokyaHYg6TQWa-miBf1IEHemuLN8T-tyCVnw3U8zmH5pj7DgDHdM8un6qVVUjzN0NGBSIWP-Gj4N0GpTqnTESyjHFRKdABGhpztSg38d0ODaCposfPAlVaLI7uKFcIWeYODU6M2sFnly2OaTe1XpThq_LNlBz1zYAU5-WB9o5QYGZ78NhO1yfneu2SdxllM3RdpROWrn9qLRIlcupSHhW9jLvrqjxtzYNQ9hvwKnunu9pbr-45MOD_CmCImrJNtPmX2XNZvq-32brv1B_DNGinc3MbmXgCKVpHhjCK3F3tywF75yNEFYBeY4fERfboujdeFtyTAlovv9cFnyhcU8rV8CwxGC1-7ls6YvNqxQgUxdrmipj4dNr6HxzNtuw%3D&searchType=oneWay&searchBags=0.0",
        "outbound": {
          "duration_seconds": 7500,
          "stops": 0,
          "segments": [
            {
              "flight_number": "1077",
              "carrier": {
                "name": "Vueling",
                "code": "VY"
              },
              "operating_carrier": {
                "name": "Vueling",
                "code": "VY"
              },
              "cabin": "ECONOMY",
              "duration_seconds": 7500,
              "from": {
                "airport": "Brussels",
                "code": "BRU",
                "city": "Brussels",
                "country": "Belgium",
                "local_time": "2026-12-27T10:10:00+01:00",
                "utc_time": "2026-12-27T09:10:00Z",
                "time": "2026-12-27T10:10:00+01:00"
              },
              "to": {
                "airport": "Barcelona–El Prat",
                "code": "BCN",
                "city": "Barcelona",
                "country": "Spain",
                "local_time": "2026-12-27T12:15:00+01:00",
                "utc_time": "2026-12-27T11:15:00Z",
                "time": "2026-12-27T12:15:00+01:00"
              },
              "layover_seconds": null
            }
          ],
          "from": {
            "airport": "Brussels",
            "code": "BRU",
            "city": "Brussels",
            "country": "Belgium",
            "local_time": "2026-12-27T10:10:00+01:00",
            "utc_time": "2026-12-27T09:10:00Z",
            "time": "2026-12-27T10:10:00+01:00"
          },
          "to": {
            "airport": "Barcelona–El Prat",
            "code": "BCN",
            "city": "Barcelona",
            "country": "Spain",
            "local_time": "2026-12-27T12:15:00+01:00",
            "utc_time": "2026-12-27T11:15:00Z",
            "time": "2026-12-27T12:15:00+01:00"
          },
          "airlines": [
            "VY"
          ]
        },
        "inbound": null,
        "origin": {
          "input": "BRU",
          "id": "Airport:BRU",
          "name": "Brussels",
          "code": "BRU",
          "type": "airport",
          "match": "code"
        },
        "destination": {
          "input": "BCN",
          "id": "Airport:BCN",
          "name": "Barcelona–El Prat",
          "code": "BCN",
          "type": "airport",
          "match": "code"
        },
        "fetched_at": "2026-11-27T17:57:28+00:00",
        "expires_at": "2026-11-27T18:27:28+00:00"
      }
    ],
    "pagination": {
      "count": 86,
      "has_more": false,
      "next_cursor": null
    },
    "fetched_at": "2026-11-27T17:57:29.513Z",
    "age": 0
  },
  "cached": null,
  "source": null,
  "pagination": {
    "total": null,
    "limit": null,
    "offset": null,
    "count": null,
    "has_more": null,
    "next_cursor": null
  },
  "fetched_at": null,
  "age": null
}
```

</details>

## More

- [Kiwi.com API page](https://maviapi.com/apis/kiwi?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi): live examples and the changelog.
- [OpenAPI document](https://api.maviapi.com/v1/apis/kiwi/openapi.json) and [Postman collection](https://api.maviapi.com/v1/apis/kiwi/postman.json).
- [maviapi MCP server](https://maviapi.com/docs#mcp): the same API as tools for Claude, Cursor and other AI agents.
- [All maviapi APIs](https://maviapi.com/apis?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi). Need a website that is not there? [Ask for it](https://maviapi.com/?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi) and get an API for it.

Other unofficial SDKs: [Airbnb](https://github.com/maviapi-sdks/airbnb-unofficial-sdk) · [Booking.com](https://github.com/maviapi-sdks/booking-unofficial-sdk) · [FlightList](https://github.com/maviapi-sdks/flightlist-unofficial-sdk) · [GetYourGuide](https://github.com/maviapi-sdks/getyourguide-unofficial-sdk) · [Google Search](https://github.com/maviapi-sdks/google-search-unofficial-sdk) · [Madrid Cultural Agenda](https://github.com/maviapi-sdks/madrid-cultural-agenda-unofficial-sdk) · [MarineTraffic](https://github.com/maviapi-sdks/marinetraffic-unofficial-sdk) · [Speedtest](https://github.com/maviapi-sdks/speedtest-unofficial-sdk) · [Trainline](https://github.com/maviapi-sdks/trainline-unofficial-sdk) · [Trendyol](https://github.com/maviapi-sdks/trendyol-unofficial-sdk) · [Tripadvisor](https://github.com/maviapi-sdks/tripadvisor-unofficial-sdk) · [Yemeksepeti](https://github.com/maviapi-sdks/yemeksepeti-unofficial-sdk)

## License

MIT. See [LICENSE](LICENSE).
