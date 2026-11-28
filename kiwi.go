// Package kiwi is an unofficial Kiwi.com API client.
//
// Search and compare flights on Kiwi.com — itineraries with live prices, airlines,
// routes and departure/arrival times, plus location and route discovery.
//
// Not affiliated with Kiwi.com. Endpoint reference: https://maviapi.com/apis/kiwi
package kiwi

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

const (
	Version = "0.1.0"
	// DemoKey is the shared demo key a client uses when it is given no key.
	DemoKey = "mvk_test_playground_5f3c1a8d"
)

// Params are an endpoint's parameters by name. Those named in the endpoint's
// path go there, the rest in the query string.
type Params map[string]any

// Error is an error status answered by the API.
type Error struct {
	Status  int
	Code    string
	Message string
}

func (e *Error) Error() string { return fmt.Sprintf("%d %s: %s", e.Status, e.Code, e.Message) }

// Client calls the Kiwi.com API. Its fields may be changed after New.
type Client struct {
	APIKey     string
	BaseURL    string
	HTTPClient *http.Client
}

// New returns a client. With an empty apiKey it uses the MAVIAPI_API_KEY
// environment variable, then the shared demo key.
func New(apiKey string) *Client {
	if apiKey == "" {
		apiKey = os.Getenv("MAVIAPI_API_KEY")
	}
	if apiKey == "" {
		apiKey = DemoKey
	}
	root := os.Getenv("MAVIAPI_BASE_URL")
	if root == "" {
		root = "https://api.maviapi.com"
	}
	return &Client{
		APIKey:     apiKey,
		BaseURL:    strings.TrimRight(root, "/") + "/v1/sites/kiwi",
		HTTPClient: &http.Client{Timeout: 120 * time.Second},
	}
}

// AirportsNear: Airports within a radius of a point, nearest first, with distance, city, country,
// time zone and Kiwi popularity.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - lat (number): latitude of the point, decimal degrees
//   - lon (number): longitude of the point, decimal degrees
//   - radius_km (number): search radius in km (default 150, max 500)
//   - include_inactive (string): "true" also returns airports Kiwi sells no flights
//     from (small airfields, military fields). One of: false, true
//   - limit (integer): Rows in one page, 1 to 50 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) AirportsNear(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/airports-near", params)
}

// Explore: The cheapest flight to every destination city from a place, like kiwi.com's
// 'anywhere' search: one row per city with price, origin and destination airports,
// local and UTC times and, for round trips, nights and return date. expand attaches
// the top 3 full itineraries for the first N cities.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - from (string): origin. A 3-letter upper-case code is an airport (else a metro
//     city code such as LON), an upper-case 2-letter code a country (else a continent
//     such as EU); otherwise a name of any place type, case and accent insensitive, or
//     a search id from /places-v2 (Airport:CRL, Country:TR). Unclear or unknown values
//     answer 400 with candidates
//   - to (string): optional broad scope for the destinations: a country, subdivision,
//     region or continent (code, name or search id); 'anywhere' for every destination
//   - date_from (string): start of the departure window, YYYY-MM-DD; defaults to 30
//     days from today
//   - date_to (string): end of the departure window, YYYY-MM-DD, inclusive; defaults
//     to date_from
//   - return_from (string): start of the return window, YYYY-MM-DD; set it for a round
//     trip, omit for one-way
//   - return_to (string): end of the return window, YYYY-MM-DD, inclusive; defaults to
//     return_from
//   - min_price (string): lowest price per destination, in currency
//   - max_price (string): highest price per destination, in currency
//   - max_stops (string): most stops per leg (0 = direct only); omit for any
//   - adults (integer): adult passengers (1-9)
//   - children (integer): child passengers (0-8)
//   - infants (integer): infant passengers, at most one per adult
//   - sort (string): which flight represents each city and the order of the cities:
//     PRICE (cheapest first), POPULARITY (kiwi.com's popular destinations first),
//     QUALITY, DURATION or DATE. The set of cities differs a little per sort. One of:
//     PRICE, POPULARITY, QUALITY, DURATION, DATE
//   - currency (string): price currency, 3-letter ISO code; min_price and max_price
//     use it too
//   - expand (integer): attach the top 3 itineraries (segments, airlines, booking
//     link) to the destinations ranked 1 to N; 0 = none
//   - limit (integer): Rows in one page, 1 to 1000 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) Explore(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/explore", params)
}

// ExploreV2: The cheapest flight to every destination city from a place, like kiwi.com's
// 'anywhere' search, with that flight on every row: airlines, stops, duration, local
// and UTC departure and arrival, segments and booking link (and the return leg for
// round trips). Same filters and destination fields as /explore; at most the first 200
// cities.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - from (string): origin. A 3-letter upper-case code is an airport (else a metro
//     city code such as LON), an upper-case 2-letter code a country (else a continent
//     such as EU); otherwise a name of any place type, case and accent insensitive, or
//     a search id from /places-v2. Unclear or unknown values answer 400 with
//     candidates
//   - to (string): optional broad scope for the destinations: a country, subdivision,
//     region or continent (code, name or search id); 'anywhere' for every destination
//   - date_from (string): start of the departure window, YYYY-MM-DD; defaults to 30
//     days from today
//   - date_to (string): end of the departure window, YYYY-MM-DD, inclusive; defaults
//     to date_from
//   - return_from (string): start of the return window, YYYY-MM-DD; set it for a round
//     trip, omit for one-way
//   - return_to (string): end of the return window, YYYY-MM-DD, inclusive; defaults to
//     return_from
//   - min_price (string): lowest price per destination, in currency
//   - max_price (string): highest price per destination, in currency
//   - max_stops (string): most stops per leg (0 = direct only); omit for any
//   - adults (integer): adult passengers (1-9)
//   - children (integer): child passengers (0-8)
//   - infants (integer): infant passengers, at most one per adult
//   - sort (string): order of the cities (and which flight sets the destination
//     price): PRICE (cheapest first), POPULARITY, QUALITY, DURATION or DATE. The
//     flight on each row is that city's cheapest itinerary. One of: PRICE, POPULARITY,
//     QUALITY, DURATION, DATE
//   - currency (string): price currency, 3-letter ISO code; min_price and max_price
//     use it too
//   - limit (integer): Rows in one page, 1 to 200 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) ExploreV2(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/explore-v2", params)
}

// Places: Kiwi locations of one type matching a name or IATA code, best match first.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - q (string): search term (place name or IATA code)
//   - type (string): location type to search: city, airport, country, region or
//     subdivision. One of: city, airport, country, region, subdivision
//   - limit (integer): Rows in one page, 1 to 200 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) Places(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/places", params)
}

// PlacesV2: Kiwi locations of every type matching a name or code, best match first; each row has
// its country and a search_id for the flight searches.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - q (string): place name or code (case and accent insensitive)
//   - type (string): optional filter, one type or a comma list of city, airport,
//     country, subdivision, region, continent, autonomous_territory, special,
//     tourist_region. Omit for every type
//   - limit (integer): Rows in one page, 1 to 1000 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) PlacesV2(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/places-v2", params)
}

// PlacesById: One Kiwi location by id or code: name, type, codes, city, country, region,
// continent, time zone, population and coordinates.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - id (string, required): a Kiwi location id: an airport code (CRL), a city id
//     (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe),
//     or a search id (Airport:CRL, City:london_gb)
//   - undefined (string)
func (c *Client) PlacesById(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/places/{id}", params, "id")
}

// Revalidate: Checks one itinerary from /search, /search-v2 or /search-v3 again before booking:
// whether the same flights are still on sale, their current total price for these
// passengers and currency, a fresh booking link and segments, fetched_at and
// expires_at. Never cached.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - id (string): the itinerary id (`id`) of a search row, one-way or return
//   - currency (string): price currency, 3-letter ISO code; pass the currency of the
//     original search to compare with quoted_price
//   - adults (integer): adult passengers (1-9)
//   - children (integer): child passengers (0-8)
//   - infants (integer): infant passengers, at most one per adult
//   - undefined (string)
func (c *Client) Revalidate(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/revalidate", params)
}

// Routes: Published city-pair routes (cheap-flights pages) from one of Kiwi's route sitemaps,
// in sitemap order.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - page (integer): which route sitemap to read, 0-based; Kiwi splits about 50k
//     routes per file across many files
//   - limit (integer): Rows in one page, 1 to 200 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) Routes(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/routes", params)
}

// Search: Flight itineraries for one departure day (and optional return day): prices,
// airlines, segments, local and UTC times and booking links, as kiwi.com ranks them
// (at most 25 per search).
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - from (string): origin: place name, IATA code or Kiwi id (london, LHR,
//     City:london_gb)
//   - to (string): destination: place name, IATA code or Kiwi id
//   - date (string): outbound departure date, YYYY-MM-DD; defaults to 30 days from
//     today. A past date gives an empty list
//   - return_date (string): inbound departure date, YYYY-MM-DD; set it for a round
//     trip, omit for one-way
//   - adults (integer): adult passengers (1-9)
//   - children (integer): child passengers (0-9)
//   - infants (integer): infant passengers (0-9, at most one per adult)
//   - cabin (string): cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
//   - sort (string): result ordering: QUALITY, PRICE or DURATION. One of: QUALITY,
//     PRICE, DURATION
//   - currency (string): price currency (ISO code)
//   - limit (integer): Rows in one page, 1 to 200 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) Search(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/search", params)
}

// SearchV2: Flight itineraries for departure (and optional return) date windows, with prices,
// segments, airlines, local and UTC times and booking links. The list holds at most
// cap (50) itineraries, in the order of sort; capped is true when kiwi.com had more
// for the search than were returned, so narrow the search (dates, places, price,
// stops) to see the rest.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - from (string): origin. A 3-letter upper-case code is an airport, searched
//     together with the other airports of its metro area as kiwi.com does (IST also
//     finds SAW), else a metro city code such as LON; an upper-case 2-letter code a
//     country (else a continent such as EU); otherwise a name of any place type (city,
//     airport, subdivision, country, region, continent), case and accent insensitive,
//     or a search id from /places-v2 (Airport:CRL, Country:TR). Unclear or unknown
//     values answer 400 with candidates
//   - to (string): destination, same rules as from, plus 'anywhere'
//   - date_from (string): start of the departure window, YYYY-MM-DD; defaults to 30
//     days from today
//   - date_to (string): end of the departure window, YYYY-MM-DD, inclusive; defaults
//     to date_from
//   - return_from (string): start of the return window, YYYY-MM-DD; set it for a round
//     trip, omit for one-way
//   - return_to (string): end of the return window, YYYY-MM-DD, inclusive; defaults to
//     return_from
//   - min_price (string): lowest total price, in currency
//   - max_price (string): highest total price, in currency
//   - max_stops (string): most stops per leg (0 = direct only); omit for any
//   - adults (integer): adult passengers (1-9)
//   - children (integer): child passengers (0-8)
//   - infants (integer): infant passengers, at most one per adult
//   - cabin (string): cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
//   - sort (string): order of the list: QUALITY (kiwi.com's best first, then the rest
//     of what it has), PRICE (cheapest first) or DURATION (shortest first). One of:
//     QUALITY, PRICE, DURATION
//   - currency (string): price currency, 3-letter ISO code; min_price and max_price
//     use it too
//   - limit (integer): Rows in one page, 1 to 200 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) SearchV2(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/search-v2", params)
}

// SearchV3: Every itinerary kiwi.com has for up to 3 origins and 3 destinations over departure
// (and return) date windows, with local departure and arrival time windows. Each
// itinerary names the origin and destination it matched (origin, destination), its
// fetch time and when its quoted price expires; total_estimate counts them and
// total_exact says whether none of the underlying searches was cut off.
//
// Each successful request uses 5 credits.
//
// Parameters:
//
//   - from (string): origin: one place or a comma list of up to 3 (BRU,CRL or
//     LON,STN). Each item: a 3-letter upper-case code is an airport (else a metro city
//     code such as LON), an upper-case 2-letter code a country (else a continent);
//     otherwise a name of any place type, case and accent insensitive, or a search id
//     from /places-v2 (Airport:CRL). Names containing a comma need their search id.
//     Unclear items answer 400 with candidates
//   - to (string): destination: one place or a comma list of up to 3, same rules, or
//     'anywhere' alone
//   - date_from (string): start of the departure window, YYYY-MM-DD; defaults to 30
//     days from today
//   - date_to (string): end of the departure window, YYYY-MM-DD, inclusive, at most 92
//     days after date_from; defaults to date_from
//   - return_from (string): start of the return window, YYYY-MM-DD; set it for a round
//     trip, omit for one-way
//   - return_to (string): end of the return window, YYYY-MM-DD, inclusive; defaults to
//     return_from
//   - departure_from (string): earliest local departure time of the outbound leg,
//     HH:MM, at the first departure airport
//   - departure_to (string): latest local departure time of the outbound leg, HH:MM
//     inclusive (up to 24:00). A window cannot cross midnight
//   - arrival_from (string): earliest local arrival time of the outbound leg, HH:MM,
//     at the final arrival airport
//   - arrival_to (string): latest local arrival time of the outbound leg, HH:MM
//     inclusive (up to 24:00). A window cannot cross midnight
//   - min_price (string): lowest total price, in currency
//   - max_price (string): highest total price, in currency
//   - max_stops (string): most stops per leg (0 = direct only); omit for any
//   - adults (integer): adult passengers (1-9)
//   - children (integer): child passengers (0-8)
//   - infants (integer): infant passengers, at most one per adult
//   - cabin (string): cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
//   - sort (string): PRICE or DURATION sort all itineraries; QUALITY keeps kiwi.com's
//     ranking inside each part of the search (the best of each first), then price. One
//     of: QUALITY, PRICE, DURATION
//   - currency (string): price currency, 3-letter ISO code; min_price and max_price
//     use it too
//   - limit (integer): Rows in one page, 1 to 200 (default 50)
//   - offset (integer): Rows to skip before the page starts (default 0)
//   - undefined (string)
//   - undefined (string)
//   - undefined (string)
func (c *Client) SearchV3(ctx context.Context, params Params) (json.RawMessage, error) {
	return c.get(ctx, "/search-v3", params)
}

func (c *Client) get(ctx context.Context, path string, params Params, required ...string) (json.RawMessage, error) {
	for _, name := range required {
		if params[name] == nil {
			return nil, fmt.Errorf("missing required parameter: %s", name)
		}
	}
	query := url.Values{}
	for name, value := range params {
		if value == nil {
			continue
		}
		text := fmt.Sprint(value)
		if token := "{" + name + "}"; strings.Contains(path, token) {
			path = strings.ReplaceAll(path, token, url.PathEscape(text))
		} else {
			query.Set(name, text)
		}
	}
	target := c.BaseURL + path
	if len(query) > 0 {
		target += "?" + query.Encode()
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, target, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "kiwi-unofficial-sdk/0.1.0 (go)")
	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	if res.StatusCode >= 400 {
		failure := &Error{Status: res.StatusCode, Code: "http_error", Message: string(body)}
		var detail struct{ Error, Message string }
		if json.Unmarshal(body, &detail) == nil && detail.Error != "" {
			failure.Code, failure.Message = detail.Error, detail.Message
		}
		return nil, failure
	}
	return body, nil
}
