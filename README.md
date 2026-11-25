# Kiwi.com Unofficial SDK

Unofficial **Kiwi.com API** client for Python, JavaScript/TypeScript, Go, PHP, Ruby, Java and C#. Search and compare flights on Kiwi.com — itineraries with live prices, airlines, routes and departure/arrival times, plus location and route discovery.

- **7 endpoints**, each returning JSON, with one method per endpoint in every language.
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
| [`GET /explore`](#get-explore) | Cheapest flight to every destination city from a place, like the site's 'anywhere' search: one row per city with price, airport and times. | 1 |
| [`GET /places`](#get-places) | Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA code. | 1 |
| [`GET /places-v2`](#get-places-v2) | Search Kiwi locations of every type by name or code, with an optional type filter. | 1 |
| [`GET /places/{id}`](#get-placesid) | One Kiwi location by id or code: name, type, codes, city, country, region, continent, time zone, population and coordinates. | 1 |
| [`GET /routes`](#get-routes) | List published city-pair routes from Kiwi route sitemaps. | 1 |
| [`GET /search`](#get-search) | Flight search: itineraries with prices, airlines, routes and departure/arrival times. | 1 |
| [`GET /search-v2`](#get-search-v2) | Flight search with departure and return date windows, a price range and a stop limit. | 1 |

Try each one in the browser on the [Kiwi.com API page](https://maviapi.com/apis/kiwi?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi).

## Authentication

A client takes the key you give it. With none, it reads the `MAVIAPI_API_KEY` environment variable, and then uses the shared demo key (30 requests a minute and 300 a day per network). To get your own, [sign up](https://maviapi.com/sign-up?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi) and create a key on the [keys page](https://maviapi.com/dashboard/keys). A successful request uses the credits its endpoint lists; a failed request is free. Plans are on the [pricing page](https://maviapi.com/pricing?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi).

## Errors

A request the API answers with an error status raises an `ApiError` (in Go, returns an `*Error`) with the HTTP status, a machine-readable code and a message. In Java it carries the status and the response body.

| Status | Code | Meaning |
|---|---|---|
| 400 | `bad_request` | A parameter is missing or cannot be used. |
| 401 | `missing_api_key` | No API key was sent, or the key is invalid or revoked (`missing_api_key`, `invalid_api_key`). |
| 402 | `credit_limit_reached` | The plan's credits for this period are used up. |
| 403 | `account_banned` | The account that owns the key is suspended. |
| 429 | `rate_limited` | Too many requests for this key. Wait the number of seconds in `Retry-After`. |
| 502 | `scrape_failed` | The source site could not be read this time. Retrying later usually works. |

## Endpoint reference

Base URL: `https://api.maviapi.com/v1/sites/kiwi`. API version 2026-11-15. The same contract is in [`openapi.json`](openapi.json).

### `GET /explore`

Cheapest flight to every destination city from a place, like the site's 'anywhere' search: one row per city with price, airport and times. Narrow by country, region or continent, dates, price and stops; expand attaches full itineraries.

Methods: `explore` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Explore` (Go) · `ExploreAsync` (C#)

Parameters:

- `from` (string, required): Origin. Codes first: a 3-letter code is an airport (else a metro city code such as LON), an upper-case 2-letter code a country (else a continent such as EU). Then a name of any place type (city, airport, subdivision, country, region, continent), case and accent insensitive, or a search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or unknown value answers 400 with candidates. Example: `London`.
- `to` (string, optional): Optional broad scope for the destinations: a country, subdivision, region or continent (code, name or search id, same rules as from). Omit or 'anywhere' for every destination. Example: `anywhere`.
- `date_from` (string, optional): Start of the departure date window, YYYY-MM-DD. Defaults to 30 days from today.
- `date_to` (string, optional): End of the departure date window, YYYY-MM-DD (inclusive). Defaults to date_from (a single day).
- `return_from` (string, optional): Start of the return date window, YYYY-MM-DD. Set it for a round trip; omit for one-way.
- `return_to` (string, optional): End of the return date window, YYYY-MM-DD (inclusive). Defaults to return_from.
- `min_price` (number, optional): Lowest price per destination, in `currency`.
- `max_price` (number, optional): Highest price per destination, in `currency`.
- `max_stops` (integer, optional): Most stops per leg (0 = direct only). Omit for any. One of: `0`, `1`, `2`, `3`. Example: `0`.
- `adults` (integer, optional): Adult passengers (1-9). Example: `1`.
- `children` (integer, optional): Child passengers (0-8). Example: `0`.
- `infants` (integer, optional): Infant passengers (at most one per adult). Example: `0`.
- `sort` (string, optional): Which flight represents each city and the order of the cities: PRICE = cheapest first, POPULARITY = the site's popular destinations first (the set differs a little per sort). One of: `PRICE`, `POPULARITY`, `QUALITY`, `DURATION`, `DATE`. Example: `PRICE`.
- `currency` (string, optional): Price currency (3-letter ISO code); min_price and max_price use it too. Example: `eur`.
- `expand` (integer, optional): Also attach the top 3 itineraries (segments, airlines, booking link) for the destinations ranked 1 to N (on whichever page they fall). 0 = none. One of: `0`, `1`, `2`, `3`, `4`, `5`. Example: `0`.
- `limit` (integer, optional): Destinations per page (max 1000). Every reachable city is returned, see pagination.total. Example: `50`.
- `offset` (integer, optional): Pagination offset over every destination city. Example: `0`.

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
            "id": "Subdivision:GA_US",
            "name": "Georgia",
            "type": "subdivision",
            "code": "GA",
            "parent": "United States"
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
          {
            "id": "Subdivision:GA_US",
            "name": "Georgia",
            "type": "subdivision",
            "code": "GA",
            "parent": "United States"
          }
        ]
      },
      "date_from": "2026-12-10",
      "date_to": "2026-12-10",
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
    "total": 89,
    "cap": 1000,
    "count": 50,
    "destinations": [
      {
        "rank": 1,
        "city": "Dublin",
        "city_id": "dublin_ie",
        "search_id": "City:dublin_ie",
        "country": {
          "code": "IE",
          "name": "Ireland"
        },
        "airport": "Dublin",
        "airport_code": "DUB",
        "price": {
          "amount": 21,
          "currency": "EUR"
        },
        "price_eur": 21,
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
          "local_time": "2026-12-10T08:45:00",
          "utc_time": "2026-12-10T08:45:00Z"
        },
        "arrival": {
          "local_time": "2026-12-10T10:05:00",
          "utc_time": "2026-12-10T10:05:00Z"
        },
        "nights": null,
        "return_departure": null,
        "itineraries": [
          {
            "id": "ItineraryOneWay:eyJwcm92...",
            "type": "oneway",
            "price": {
              "amount": 71,
              "currency": "EUR"
            },
            "price_eur": 71,
            "duration_seconds": 14400,
            "provider": "Kiwi.com",
            "booking_url": "https://www.kiwi.com/en/booking/?token=...",
            "outbound": {
              "duration_seconds": 14400,
              "stops": 0,
              "segments": [
                {
                  "flight_number": "5729",
                  "carrier": {
                    "name": "Wizz Air UK",
                    "code": "W9"
                  },
                  "duration_seconds": 14400,
                  "from": {
                    "airport": "Gatwick",
                    "code": "LGW",
                    "city": "London",
                    "country": "United Kingdom",
                    "local_time": "2026-09-10T13:30:00",
                    "utc_time": "2026-09-10T12:30:00"
                  },
                  "to": {
                    "airport": "Istanbul Airport",
                    "code": "IST",
                    "city": "Istanbul",
                    "country": "Turkey",
                    "local_time": "2026-09-10T19:30:00",
                    "utc_time": "2026-09-10T16:30:00"
                  }
                }
              ],
              "from": {
                "airport": "Gatwick",
                "code": "LGW",
                "city": "London",
                "country": "United Kingdom",
                "local_time": "2026-09-10T13:30:00",
                "utc_time": "2026-09-10T12:30:00"
              },
              "to": {
                "airport": "Istanbul Airport",
                "code": "IST",
                "city": "Istanbul",
                "country": "Turkey",
                "local_time": "2026-09-10T19:30:00",
                "utc_time": "2026-09-10T16:30:00"
              }
            },
            "inbound": {
              "duration_seconds": 14400,
              "stops": 0,
              "segments": [
                {
                  "flight_number": "5729",
                  "carrier": {
                    "name": "Wizz Air UK",
                    "code": "W9"
                  },
                  "duration_seconds": 14400,
                  "from": {
                    "airport": "Gatwick",
                    "code": "LGW",
                    "city": "London",
                    "country": "United Kingdom",
                    "local_time": "2026-09-10T13:30:00",
                    "utc_time": "2026-09-10T12:30:00"
                  },
                  "to": {
                    "airport": "Istanbul Airport",
                    "code": "IST",
                    "city": "Istanbul",
                    "country": "Turkey",
                    "local_time": "2026-09-10T19:30:00",
                    "utc_time": "2026-09-10T16:30:00"
                  }
                }
              ],
              "from": {
                "airport": "Gatwick",
                "code": "LGW",
                "city": "London",
                "country": "United Kingdom",
                "local_time": "2026-09-10T13:30:00",
                "utc_time": "2026-09-10T12:30:00"
              },
              "to": {
                "airport": "Istanbul Airport",
                "code": "IST",
                "city": "Istanbul",
                "country": "Turkey",
                "local_time": "2026-09-10T19:30:00",
                "utc_time": "2026-09-10T16:30:00"
              }
            }
          }
        ]
      }
    ]
  },
  "cached": false,
  "source": "kiwi:graphql",
  "pagination": {
    "total": 192,
    "limit": 50,
    "offset": 0,
    "count": 50,
    "has_more": true
  }
}
```

</details>

### `GET /places`

Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA code. Params: q, type, limit/offset.

Methods: `places` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Places` (Go) · `PlacesAsync` (C#)

Parameters:

- `q` (string, optional): Search term (place name or IATA code). Example: `paris`.
- `type` (string, optional): Location type to search. One of: `city`, `airport`, `country`, `region`, `subdivision`. Example: `city`.
- `limit` (integer, optional): Max places per page. Example: `10`.
- `offset` (integer, optional): Pagination offset. Example: `0`.

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
        "subdivision": "Ile-de-France",
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
    ]
  },
  "cached": false,
  "source": "kiwi:locations",
  "pagination": {
    "total": 6,
    "limit": 50,
    "offset": 0,
    "count": 50,
    "has_more": false
  }
}
```

</details>

### `GET /places-v2`

Search Kiwi locations of every type by name or code, with an optional type filter. Every row carries its country (airports included) and a search_id for /search-v2.

Methods: `places_v2` (Python, Ruby) · `placesV2` (JavaScript/TypeScript, PHP, Java) · `PlacesV2` (Go) · `PlacesV2Async` (C#)

Parameters:

- `q` (string, required): Place name or code (case and accent insensitive). Example: `CRL`.
- `type` (string, optional): Optional filter: one type or a comma list of city, airport, country, subdivision, region, continent, autonomous_territory, special, tourist_region. Omit to search every type. One of: `city`, `airport`, `country`, `subdivision`, `region`, `continent`, `autonomous_territory`, `special`, `tourist_region`. Example: `city`.
- `limit` (integer, optional): Places per page (max 1000). Example: `50`.
- `offset` (integer, optional): Pagination offset within the at most 1000 places of a query (see data.cap). Example: `0`.

<details>
<summary>Example response</summary>

```json
{
  "data": {
    "query": "CRL",
    "types": "all",
    "total": 192,
    "cap": 1000,
    "capped": false,
    "count": 50,
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
    ]
  },
  "cached": false,
  "source": "kiwi:locations",
  "pagination": {
    "total": 192,
    "limit": 50,
    "offset": 0,
    "count": 50,
    "has_more": true
  }
}
```

</details>

### `GET /places/{id}`

One Kiwi location by id or code: name, type, codes, city, country, region, continent, time zone, population and coordinates.

Methods: `places_id` (Python, Ruby) · `placesId` (JavaScript/TypeScript, PHP, Java) · `PlacesId` (Go) · `PlacesIdAsync` (C#)

Parameters:

- `id` (string, required, in the path): A Kiwi location id: an airport code (CRL), a city id (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe), or a search id from /places-v2 or /explore (Airport:CRL, City:london_gb). Example: `CRL`.

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
    }
  },
  "cached": false,
  "source": "kiwi:locations"
}
```

</details>

### `GET /routes`

List published city-pair routes from Kiwi route sitemaps. Params: page, limit/offset.

Methods: `routes` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Routes` (Go) · `RoutesAsync` (C#)

Parameters:

- `page` (integer, optional): Which route sub-sitemap to read (0-based). Kiwi splits ~50k routes per file across many files. Example: `0`.
- `limit` (integer, optional): Max routes per page. Example: `10`.
- `offset` (integer, optional): Pagination offset within the sub-sitemap. Example: `0`.

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
    ]
  },
  "cached": false,
  "source": "kiwi:sitemap",
  "pagination": {
    "total": 49949,
    "limit": 50,
    "offset": 0,
    "count": 50,
    "has_more": false
  }
}
```

</details>

### `GET /search`

Flight search: itineraries with prices, airlines, routes and departure/arrival times. from/to accept place names, IATA codes or Kiwi ids; date/return_date, adults/children/infants, cabin, sort, currency, limit/offset.

Methods: `search` (Python, JavaScript/TypeScript, PHP, Ruby, Java) · `Search` (Go) · `SearchAsync` (C#)

Parameters:

- `from` (string, required): Origin: place name, IATA code or Kiwi id (e.g. 'london', 'LHR', 'City:london_gb'). Example: `london`.
- `to` (string, required): Destination: place name, IATA code or Kiwi id. Example: `istanbul`.
- `date` (string, optional): Outbound departure date, YYYY-MM-DD. Defaults to ~30 days out. Example: `2026-12-25`.
- `return_date` (string, optional): Optional inbound date, YYYY-MM-DD. Set it for a round trip; omit for one-way. Example: `2027-01-01`.
- `adults` (integer, optional): Adult passengers (1-9). Example: `1`.
- `children` (integer, optional): Child passengers (0-9). Example: `0`.
- `infants` (integer, optional): Infant passengers (0-9). Example: `0`.
- `cabin` (string, optional): Cabin class. One of: `ECONOMY`, `PREMIUM_ECONOMY`, `BUSINESS`, `FIRST`. Example: `ECONOMY`.
- `sort` (string, optional): Result ordering. One of: `QUALITY`, `PRICE`, `DURATION`. Example: `QUALITY`.
- `currency` (string, optional): Price currency (ISO code). Example: `eur`.
- `limit` (integer, optional): Max itineraries per page. Example: `10`.
- `offset` (integer, optional): Pagination offset. Example: `0`.

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
      "date": "2026-09-10",
      "return_date": null,
      "trip_type": "oneway",
      "passengers": {
        "adults": 1,
        "children": 0,
        "infants": 0
      },
      "cabin": "ECONOMY",
      "sort": "PRICE",
      "currency": "EUR"
    },
    "total": 50,
    "count": 50,
    "itineraries": [
      {
        "id": "ItineraryOneWay:eyJwcm92...",
        "type": "oneway",
        "price": {
          "amount": 71,
          "currency": "EUR"
        },
        "price_eur": 71,
        "duration_seconds": 14400,
        "provider": "Kiwi.com",
        "booking_url": "https://www.kiwi.com/en/booking/?token=...",
        "outbound": {
          "duration_seconds": 14400,
          "stops": 0,
          "segments": [
            {
              "flight_number": "5729",
              "carrier": {
                "name": "Wizz Air UK",
                "code": "W9"
              },
              "duration_seconds": 14400,
              "from": {
                "airport": "Gatwick",
                "code": "LGW",
                "city": "London",
                "country": "United Kingdom",
                "local_time": "2026-09-10T13:30:00",
                "utc_time": "2026-09-10T12:30:00"
              },
              "to": {
                "airport": "Istanbul Airport",
                "code": "IST",
                "city": "Istanbul",
                "country": "Turkey",
                "local_time": "2026-09-10T19:30:00",
                "utc_time": "2026-09-10T16:30:00"
              }
            }
          ],
          "from": {
            "airport": "Gatwick",
            "code": "LGW",
            "city": "London",
            "country": "United Kingdom",
            "local_time": "2026-09-10T13:30:00",
            "utc_time": "2026-09-10T12:30:00"
          },
          "to": {
            "airport": "Istanbul Airport",
            "code": "IST",
            "city": "Istanbul",
            "country": "Turkey",
            "local_time": "2026-09-10T19:30:00",
            "utc_time": "2026-09-10T16:30:00"
          }
        },
        "inbound": {
          "duration_seconds": 14400,
          "stops": 0,
          "segments": [
            {
              "flight_number": "5729",
              "carrier": {
                "name": "Wizz Air UK",
                "code": "W9"
              },
              "duration_seconds": 14400,
              "from": {
                "airport": "Gatwick",
                "code": "LGW",
                "city": "London",
                "country": "United Kingdom",
                "local_time": "2026-09-10T13:30:00",
                "utc_time": "2026-09-10T12:30:00"
              },
              "to": {
                "airport": "Istanbul Airport",
                "code": "IST",
                "city": "Istanbul",
                "country": "Turkey",
                "local_time": "2026-09-10T19:30:00",
                "utc_time": "2026-09-10T16:30:00"
              }
            }
          ],
          "from": {
            "airport": "Gatwick",
            "code": "LGW",
            "city": "London",
            "country": "United Kingdom",
            "local_time": "2026-09-10T13:30:00",
            "utc_time": "2026-09-10T12:30:00"
          },
          "to": {
            "airport": "Istanbul Airport",
            "code": "IST",
            "city": "Istanbul",
            "country": "Turkey",
            "local_time": "2026-09-10T19:30:00",
            "utc_time": "2026-09-10T16:30:00"
          }
        }
      }
    ]
  },
  "cached": false,
  "source": "kiwi:graphql",
  "pagination": {
    "total": 50,
    "limit": 50,
    "offset": 0,
    "count": 50,
    "has_more": false
  }
}
```

</details>

### `GET /search-v2`

Flight search with departure and return date windows, a price range and a stop limit. from/to take codes, names of any place type, countries, regions, continents, or to=anywhere; unclear values answer 400 with candidates. At most 50 itineraries per search: narrow it to reach others.

Methods: `search_v2` (Python, Ruby) · `searchV2` (JavaScript/TypeScript, PHP, Java) · `SearchV2` (Go) · `SearchV2Async` (C#)

Parameters:

- `from` (string, required): Origin. Codes first: a 3-letter code is an airport (else a metro city code such as LON), an upper-case 2-letter code a country (else a continent such as EU). Then a name of any place type (city, airport, subdivision, country, region, continent), case and accent insensitive, or a search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or unknown value answers 400 with candidates. Example: `CRL`.
- `to` (string, required): Destination, same rules as from, plus 'anywhere' for every destination. Example: `Europe`.
- `date_from` (string, optional): Start of the departure date window, YYYY-MM-DD. Defaults to 30 days from today.
- `date_to` (string, optional): End of the departure date window, YYYY-MM-DD (inclusive). Defaults to date_from (a single day).
- `return_from` (string, optional): Start of the return date window, YYYY-MM-DD. Set it for a round trip; omit for one-way.
- `return_to` (string, optional): End of the return date window, YYYY-MM-DD (inclusive). Defaults to return_from.
- `min_price` (number, optional): Lowest total price, in `currency`.
- `max_price` (number, optional): Highest total price, in `currency`.
- `max_stops` (integer, optional): Most stops per leg (0 = direct only). Omit for any. One of: `0`, `1`, `2`, `3`. Example: `0`.
- `adults` (integer, optional): Adult passengers (1-9). Example: `1`.
- `children` (integer, optional): Child passengers (0-8). Example: `0`.
- `infants` (integer, optional): Infant passengers (at most one per adult). Example: `0`.
- `cabin` (string, optional): Cabin class. One of: `ECONOMY`, `PREMIUM_ECONOMY`, `BUSINESS`, `FIRST`. Example: `ECONOMY`.
- `sort` (string, optional): Which 50 itineraries the search keeps, and their order. One of: `QUALITY`, `PRICE`, `DURATION`. Example: `QUALITY`.
- `currency` (string, optional): Price currency (3-letter ISO code); min_price and max_price use it too. Example: `eur`.
- `limit` (integer, optional): Itineraries per page. A search returns at most 50 itineraries (see data.cap). Example: `50`.
- `offset` (integer, optional): Offset within the at most 50 itineraries of this search. Rows past 50 are not reachable by offset: narrow the dates, price or stops instead. Example: `0`.

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
          {
            "id": "Subdivision:GA_US",
            "name": "Georgia",
            "type": "subdivision",
            "code": "GA",
            "parent": "United States"
          }
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
          {
            "id": "Subdivision:GA_US",
            "name": "Georgia",
            "type": "subdivision",
            "code": "GA",
            "parent": "United States"
          }
        ]
      },
      "date_from": "2026-12-10",
      "date_to": "2026-12-16",
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
        "id": "ItineraryOneWay:eyJwcm92...",
        "type": "oneway",
        "price": {
          "amount": 71,
          "currency": "EUR"
        },
        "price_eur": 71,
        "duration_seconds": 14400,
        "provider": "Kiwi.com",
        "booking_url": "https://www.kiwi.com/en/booking/?token=...",
        "outbound": {
          "duration_seconds": 14400,
          "stops": 0,
          "segments": [
            {
              "flight_number": "5729",
              "carrier": {
                "name": "Wizz Air UK",
                "code": "W9"
              },
              "duration_seconds": 14400,
              "from": {
                "airport": "Gatwick",
                "code": "LGW",
                "city": "London",
                "country": "United Kingdom",
                "local_time": "2026-09-10T13:30:00",
                "utc_time": "2026-09-10T12:30:00"
              },
              "to": {
                "airport": "Istanbul Airport",
                "code": "IST",
                "city": "Istanbul",
                "country": "Turkey",
                "local_time": "2026-09-10T19:30:00",
                "utc_time": "2026-09-10T16:30:00"
              }
            }
          ],
          "from": {
            "airport": "Gatwick",
            "code": "LGW",
            "city": "London",
            "country": "United Kingdom",
            "local_time": "2026-09-10T13:30:00",
            "utc_time": "2026-09-10T12:30:00"
          },
          "to": {
            "airport": "Istanbul Airport",
            "code": "IST",
            "city": "Istanbul",
            "country": "Turkey",
            "local_time": "2026-09-10T19:30:00",
            "utc_time": "2026-09-10T16:30:00"
          }
        },
        "inbound": {
          "duration_seconds": 14400,
          "stops": 0,
          "segments": [
            {
              "flight_number": "5729",
              "carrier": {
                "name": "Wizz Air UK",
                "code": "W9"
              },
              "duration_seconds": 14400,
              "from": {
                "airport": "Gatwick",
                "code": "LGW",
                "city": "London",
                "country": "United Kingdom",
                "local_time": "2026-09-10T13:30:00",
                "utc_time": "2026-09-10T12:30:00"
              },
              "to": {
                "airport": "Istanbul Airport",
                "code": "IST",
                "city": "Istanbul",
                "country": "Turkey",
                "local_time": "2026-09-10T19:30:00",
                "utc_time": "2026-09-10T16:30:00"
              }
            }
          ],
          "from": {
            "airport": "Gatwick",
            "code": "LGW",
            "city": "London",
            "country": "United Kingdom",
            "local_time": "2026-09-10T13:30:00",
            "utc_time": "2026-09-10T12:30:00"
          },
          "to": {
            "airport": "Istanbul Airport",
            "code": "IST",
            "city": "Istanbul",
            "country": "Turkey",
            "local_time": "2026-09-10T19:30:00",
            "utc_time": "2026-09-10T16:30:00"
          }
        }
      }
    ]
  },
  "cached": false,
  "source": "kiwi:graphql",
  "pagination": {
    "total": 50,
    "limit": 50,
    "offset": 0,
    "count": 50,
    "has_more": false
  }
}
```

</details>

## More

- [Kiwi.com API page](https://maviapi.com/apis/kiwi?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi): live examples and the changelog.
- [OpenAPI document](https://api.maviapi.com/v1/apis/kiwi/openapi.json) and [Postman collection](https://api.maviapi.com/v1/apis/kiwi/postman.json).
- [maviapi MCP server](https://maviapi.com/docs#mcp): the same API as tools for Claude, Cursor and other AI agents.
- [All maviapi APIs](https://maviapi.com/apis?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi). Need a website that is not there? [Ask for it](https://maviapi.com/?utm_source=github&utm_medium=readme&utm_campaign=sdk-kiwi) and get an API for it.

Other unofficial SDKs: [Airbnb](https://github.com/maviapi-sdks/airbnb-unofficial-sdk) · [Booking.com](https://github.com/maviapi-sdks/booking-unofficial-sdk) · [GetYourGuide](https://github.com/maviapi-sdks/getyourguide-unofficial-sdk) · [MarineTraffic](https://github.com/maviapi-sdks/marinetraffic-unofficial-sdk) · [Speedtest](https://github.com/maviapi-sdks/speedtest-unofficial-sdk) · [Trainline](https://github.com/maviapi-sdks/trainline-unofficial-sdk) · [Trendyol](https://github.com/maviapi-sdks/trendyol-unofficial-sdk) · [Tripadvisor](https://github.com/maviapi-sdks/tripadvisor-unofficial-sdk) · [Yemeksepeti](https://github.com/maviapi-sdks/yemeksepeti-unofficial-sdk)

## License

MIT. See [LICENSE](LICENSE).
