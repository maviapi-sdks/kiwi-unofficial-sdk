<?php

// Unofficial Kiwi.com API client for PHP.
// Not affiliated with Kiwi.com. Endpoint reference: https://maviapi.com/apis/kiwi

declare(strict_types=1);

namespace KiwiSdk;

/** An error status answered by the API. */
class ApiError extends \RuntimeException
{
    public function __construct(
        public readonly int $status,
        public readonly string $errorCode,
        string $message,
    ) {
        parent::__construct("$status $errorCode: $message", $status);
    }
}

class KiwiClient
{
    public const DEMO_KEY = 'mvk_test_playground_5f3c1a8d';

    private string $apiKey;
    private string $baseUrl;

    /**
     * With no $apiKey it uses the MAVIAPI_API_KEY environment variable, then the
     * shared demo key.
     */
    public function __construct(?string $apiKey = null, ?string $baseUrl = null, private int $timeout = 120)
    {
        $this->apiKey = $apiKey ?: (getenv('MAVIAPI_API_KEY') ?: self::DEMO_KEY);
        $root = $baseUrl ?: (getenv('MAVIAPI_BASE_URL') ?: 'https://api.maviapi.com');
        $this->baseUrl = rtrim($root, '/') . '/v1/sites/kiwi';
    }

    /**
     * Airports within a radius of a lat/lon point, nearest first, with distance, city,
     * country and a popularity hint.
     *
     * Parameters:
     *   $lat (number, required): Latitude of the point, in decimal degrees
     *   $lon (number, required): Longitude of the point, in decimal degrees
     *   $radius_km (number): Search radius in km (default 150, max 500)
     *   $include_inactive (string): true also returns airports Kiwi sells no flights
     *     from (small airfields, military fields). One of: false, true
     *   $limit (integer): Airports per page. The source returns at most the 50 nearest
     *     airports per call (data.capped); narrow radius_km to stay under it
     *   $offset (integer): Offset within the at most 50 nearest airports of a call
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function airportsNear(float $lat, float $lon, ?float $radius_km = null, ?string $include_inactive = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/airports-near', ['lat' => $lat, 'lon' => $lon, 'radius_km' => $radius_km, 'include_inactive' => $include_inactive, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * Cheapest flight to every destination city from a place, like the site's 'anywhere'
     * search: one row per city with price, airport and times. Narrow by country, region or
     * continent, dates, price and stops; expand attaches full itineraries.
     *
     * Parameters:
     *   $from (string, required): Origin. Codes first: a 3-letter code is an airport
     *     (else a metro city code such as LON), an upper-case 2-letter code a country
     *     (else a continent such as EU). Then a name of any place type (city, airport,
     *     subdivision, country, region, continent), case and accent insensitive, or a
     *     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
     *     unknown value answers 400 with candidates
     *   $to (string): Optional broad scope for the destinations: a country, subdivision,
     *     region or continent (code, name or search id, same rules as from). Omit or
     *     'anywhere' for every destination
     *   $date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
     *     30 days from today
     *   $date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
     *     Defaults to date_from (a single day)
     *   $return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
     *     round trip; omit for one-way
     *   $return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
     *     Defaults to return_from
     *   $min_price (number): Lowest price per destination, in `currency`
     *   $max_price (number): Highest price per destination, in `currency`
     *   $max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One
     *     of: 0, 1, 2, 3
     *   $adults (integer): Adult passengers (1-9)
     *   $children (integer): Child passengers (0-8)
     *   $infants (integer): Infant passengers (at most one per adult)
     *   $sort (string): Which flight represents each city and the order of the cities:
     *     PRICE = cheapest first, POPULARITY = the site's popular destinations first (the
     *     set differs a little per sort). One of: PRICE, POPULARITY, QUALITY, DURATION,
     *     DATE
     *   $currency (string): Price currency (3-letter ISO code); min_price and max_price
     *     use it too
     *   $expand (integer): Also attach the top 3 itineraries (segments, airlines,
     *     booking link) for the destinations ranked 1 to N (on whichever page they fall).
     *     0 = none. One of: 0, 1, 2, 3, 4, 5
     *   $limit (integer): Destinations per page (max 1000). Every reachable city is
     *     returned, see pagination.total
     *   $offset (integer): Pagination offset over every destination city
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function explore(string $from, ?string $to = null, ?string $date_from = null, ?string $date_to = null, ?string $return_from = null, ?string $return_to = null, ?float $min_price = null, ?float $max_price = null, ?int $max_stops = null, ?int $adults = null, ?int $children = null, ?int $infants = null, ?string $sort = null, ?string $currency = null, ?int $expand = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/explore', ['from' => $from, 'to' => $to, 'date_from' => $date_from, 'date_to' => $date_to, 'return_from' => $return_from, 'return_to' => $return_to, 'min_price' => $min_price, 'max_price' => $max_price, 'max_stops' => $max_stops, 'adults' => $adults, 'children' => $children, 'infants' => $infants, 'sort' => $sort, 'currency' => $currency, 'expand' => $expand, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * Cheapest flight to every destination city from a place, like the site's 'anywhere'
     * search, with that flight's airlines, stops, duration, local departure and arrival
     * times and booking link on every row. Same filters and destination fields as
     * /explore; paged by cursor.
     *
     * Parameters:
     *   $from (string, required): Origin. Codes first: a 3-letter code is an airport
     *     (else a metro city code such as LON), an upper-case 2-letter code a country
     *     (else a continent such as EU). Then a name of any place type (city, airport,
     *     subdivision, country, region, continent), case and accent insensitive, or a
     *     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
     *     unknown value answers 400 with candidates
     *   $to (string): Optional broad scope for the destinations: a country, subdivision,
     *     region or continent (code, name or search id, same rules as from). Omit or
     *     'anywhere' for every destination
     *   $date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
     *     30 days from today
     *   $date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
     *     Defaults to date_from (a single day)
     *   $return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
     *     round trip; omit for one-way
     *   $return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
     *     Defaults to return_from
     *   $min_price (number): Lowest price per destination, in `currency`
     *   $max_price (number): Highest price per destination, in `currency`
     *   $max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One
     *     of: 0, 1, 2, 3
     *   $adults (integer): Adult passengers (1-9)
     *   $children (integer): Child passengers (0-8)
     *   $infants (integer): Infant passengers (at most one per adult)
     *   $sort (string): Order of the cities (and which flight sets the destination
     *     price): PRICE = cheapest first, POPULARITY = the site's popular destinations
     *     first. The flight on each row is always that city's cheapest itinerary. One of:
     *     PRICE, POPULARITY, QUALITY, DURATION, DATE
     *   $currency (string): Price currency (3-letter ISO code); min_price and max_price
     *     use it too
     *   $limit (integer): Destinations per page (max 200). Every reachable city is
     *     returned, see pagination.total; walk the rest with cursor
     *   $offset (integer): Pagination offset over every destination city
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function exploreV2(string $from, ?string $to = null, ?string $date_from = null, ?string $date_to = null, ?string $return_from = null, ?string $return_to = null, ?float $min_price = null, ?float $max_price = null, ?int $max_stops = null, ?int $adults = null, ?int $children = null, ?int $infants = null, ?string $sort = null, ?string $currency = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/explore-v2', ['from' => $from, 'to' => $to, 'date_from' => $date_from, 'date_to' => $date_to, 'return_from' => $return_from, 'return_to' => $return_to, 'min_price' => $min_price, 'max_price' => $max_price, 'max_stops' => $max_stops, 'adults' => $adults, 'children' => $children, 'infants' => $infants, 'sort' => $sort, 'currency' => $currency, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA
     * code. Params: q, type, limit/offset.
     *
     * Parameters:
     *   $q (string): Search term (place name or IATA code)
     *   $type (string): Location type to search. One of: city, airport, country, region,
     *     subdivision
     *   $limit (integer): Max places per page
     *   $offset (integer): Pagination offset
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function places(?string $q = null, ?string $type = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/places', ['q' => $q, 'type' => $type, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * Search Kiwi locations of every type by name or code, with an optional type filter.
     * Every row carries its country (airports included) and a search_id for /search-v2.
     *
     * Parameters:
     *   $q (string, required): Place name or code (case and accent insensitive)
     *   $type (string): Optional filter: one type or a comma list of city, airport,
     *     country, subdivision, region, continent, autonomous_territory, special,
     *     tourist_region. Omit to search every type. One of: city, airport, country,
     *     subdivision, region, continent, autonomous_territory, special, tourist_region
     *   $limit (integer): Places per page (max 1000)
     *   $offset (integer): Pagination offset within the at most 1000 places of a query
     *     (see data.cap)
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function placesV2(string $q, ?string $type = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/places-v2', ['q' => $q, 'type' => $type, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * One Kiwi location by id or code: name, type, codes, city, country, region,
     * continent, time zone, population and coordinates.
     *
     * Parameters:
     *   $id (string, required): A Kiwi location id: an airport code (CRL), a city id
     *     (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe),
     *     or a search id from /places-v2 or /explore (Airport:CRL, City:london_gb)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function placesById(string $id, ?string $undefined = null): array
    {
        return $this->get('/places/{id}', ['id' => $id, undefined => $undefined]);
    }

    /**
     * Check one itinerary from /search-v2 or /search-v3 again before booking: whether it
     * is still available, its current price for the given passengers and currency, a fresh
     * booking link, fetched_at and expires_at. Never cached.
     *
     * Parameters:
     *   $id (string, required): The itinerary id (`id`) of a row from /search-v2 or
     *     /search-v3, one-way or return
     *   $currency (string): Price currency (3-letter ISO code). Pass the currency of the
     *     search the id came from to compare with quoted_price
     *   $adults (integer): Adult passengers (1-9)
     *   $children (integer): Child passengers (0-8)
     *   $infants (integer): Infant passengers, at most one per adult
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function revalidate(string $id, ?string $currency = null, ?int $adults = null, ?int $children = null, ?int $infants = null, ?string $undefined = null): array
    {
        return $this->get('/revalidate', ['id' => $id, 'currency' => $currency, 'adults' => $adults, 'children' => $children, 'infants' => $infants, undefined => $undefined]);
    }

    /**
     * List published city-pair routes from Kiwi route sitemaps. Params: page,
     * limit/offset.
     *
     * Parameters:
     *   $page (integer): Which route sub-sitemap to read (0-based). Kiwi splits ~50k
     *     routes per file across many files
     *   $limit (integer): Max routes per page
     *   $offset (integer): Pagination offset within the sub-sitemap
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function routes(?int $page = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/routes', ['page' => $page, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * Flight search: itineraries with prices, airlines, routes and departure/arrival
     * times. from/to accept place names, IATA codes or Kiwi ids; date/return_date,
     * adults/children/infants, cabin, sort, currency, limit/offset.
     *
     * Parameters:
     *   $from (string, required): Origin: place name, IATA code or Kiwi id (e.g.
     *     'london', 'LHR', 'City:london_gb')
     *   $to (string, required): Destination: place name, IATA code or Kiwi id
     *   $date (string): Outbound departure date, YYYY-MM-DD. Defaults to ~30 days out
     *   $return_date (string): Optional inbound date, YYYY-MM-DD. Set it for a round
     *     trip; omit for one-way
     *   $adults (integer): Adult passengers (1-9)
     *   $children (integer): Child passengers (0-9)
     *   $infants (integer): Infant passengers (0-9)
     *   $cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
     *   $sort (string): Result ordering. One of: QUALITY, PRICE, DURATION
     *   $currency (string): Price currency (ISO code)
     *   $limit (integer): Max itineraries per page
     *   $offset (integer): Pagination offset
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function search(string $from, string $to, ?string $date = null, ?string $return_date = null, ?int $adults = null, ?int $children = null, ?int $infants = null, ?string $cabin = null, ?string $sort = null, ?string $currency = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/search', ['from' => $from, 'to' => $to, 'date' => $date, 'return_date' => $return_date, 'adults' => $adults, 'children' => $children, 'infants' => $infants, 'cabin' => $cabin, 'sort' => $sort, 'currency' => $currency, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * Flight search with departure and return date windows, a price range and a stop
     * limit. from/to take codes, names of any place type, countries, regions, continents,
     * or to=anywhere; unclear values answer 400 with candidates. At most 50 itineraries
     * per search: narrow it to reach others.
     *
     * Parameters:
     *   $from (string, required): Origin. Codes first: a 3-letter code is an airport
     *     (else a metro city code such as LON), an upper-case 2-letter code a country
     *     (else a continent such as EU). Then a name of any place type (city, airport,
     *     subdivision, country, region, continent), case and accent insensitive, or a
     *     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
     *     unknown value answers 400 with candidates
     *   $to (string, required): Destination, same rules as from, plus 'anywhere' for
     *     every destination
     *   $date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
     *     30 days from today
     *   $date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
     *     Defaults to date_from (a single day)
     *   $return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
     *     round trip; omit for one-way
     *   $return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
     *     Defaults to return_from
     *   $min_price (number): Lowest total price, in `currency`
     *   $max_price (number): Highest total price, in `currency`
     *   $max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One
     *     of: 0, 1, 2, 3
     *   $adults (integer): Adult passengers (1-9)
     *   $children (integer): Child passengers (0-8)
     *   $infants (integer): Infant passengers (at most one per adult)
     *   $cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
     *   $sort (string): Which 50 itineraries the search keeps, and their order. One of:
     *     QUALITY, PRICE, DURATION
     *   $currency (string): Price currency (3-letter ISO code); min_price and max_price
     *     use it too
     *   $limit (integer): Itineraries per page. A search returns at most 50 itineraries
     *     (see data.cap)
     *   $offset (integer): Offset within the at most 50 itineraries of this search. Rows
     *     past 50 are not reachable by offset: narrow the dates, price or stops instead
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function searchV2(string $from, string $to, ?string $date_from = null, ?string $date_to = null, ?string $return_from = null, ?string $return_to = null, ?float $min_price = null, ?float $max_price = null, ?int $max_stops = null, ?int $adults = null, ?int $children = null, ?int $infants = null, ?string $cabin = null, ?string $sort = null, ?string $currency = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/search-v2', ['from' => $from, 'to' => $to, 'date_from' => $date_from, 'date_to' => $date_to, 'return_from' => $return_from, 'return_to' => $return_to, 'min_price' => $min_price, 'max_price' => $max_price, 'max_stops' => $max_stops, 'adults' => $adults, 'children' => $children, 'infants' => $infants, 'cabin' => $cabin, 'sort' => $sort, 'currency' => $currency, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * Flight search with date windows plus several origins and destinations
     * (from=BRU,CRL), local departure and arrival time windows, and every itinerary the
     * search has, paged by cursor, with total_estimate. Each itinerary names the origin
     * and destination it matched and when its price expires.
     *
     * Parameters:
     *   $from (string, required): Origin: one place or a comma list of up to 3 (BRU,CRL
     *     or LON,STN). Each item follows the /search-v2 rules: a 3-letter code is an
     *     airport (else a metro city code such as LON), an upper-case 2-letter code a
     *     country (else a continent), then a name of any place type, case and accent
     *     insensitive, or a search id from /places-v2 ('Airport:CRL'). Names that contain
     *     a comma need their search id. An unclear item answers 400 with candidates
     *   $to (string, required): Destination: one place or a comma list of up to 3, same
     *     rules as from, or 'anywhere' alone for every destination
     *   $date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
     *     30 days from today
     *   $date_to (string): End of the departure date window, YYYY-MM-DD (inclusive, at
     *     most 92 days after date_from). Defaults to date_from (a single day)
     *   $return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
     *     round trip; omit for one-way
     *   $return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
     *     Defaults to return_from
     *   $departure_from (string): Earliest local departure time of the outbound leg,
     *     HH:MM (00:00 to 23:59), at the first departure airport. A window cannot cross
     *     midnight
     *   $departure_to (string): Latest local departure time of the outbound leg, HH:MM
     *     (inclusive, 00:00 to 24:00), at the first departure airport. A window cannot
     *     cross midnight
     *   $arrival_from (string): Earliest local arrival time of the outbound leg, HH:MM
     *     (00:00 to 23:59), at the final arrival airport. A window cannot cross midnight
     *   $arrival_to (string): Latest local arrival time of the outbound leg, HH:MM
     *     (inclusive, 00:00 to 24:00), at the final arrival airport. A window cannot cross
     *     midnight
     *   $min_price (number): Lowest total price, in `currency`
     *   $max_price (number): Highest total price, in `currency`
     *   $max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One
     *     of: 0, 1, 2, 3
     *   $adults (integer): Adult passengers (1-9)
     *   $children (integer): Child passengers (0-8)
     *   $infants (integer): Infant passengers (at most one per adult)
     *   $cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
     *   $sort (string): Order of the itineraries. PRICE and DURATION sort all of them;
     *     QUALITY keeps the site's own ranking inside each part of the search (the best of
     *     each first), then price. One of: QUALITY, PRICE, DURATION
     *   $currency (string): Price currency (3-letter ISO code); min_price and max_price
     *     use it too
     *   $limit (integer): Itineraries per page. Every itinerary of the search is
     *     reachable: follow pagination.next_cursor (or offset) while pagination.has_more
     *     is true
     *   $offset (integer): Offset into all the itineraries of the search
     *   $undefined (string)
     *   $undefined (string)
     *   $undefined (string)
     *
     * @return array<string, mixed>
     */
    public function searchV3(string $from, string $to, ?string $date_from = null, ?string $date_to = null, ?string $return_from = null, ?string $return_to = null, ?string $departure_from = null, ?string $departure_to = null, ?string $arrival_from = null, ?string $arrival_to = null, ?float $min_price = null, ?float $max_price = null, ?int $max_stops = null, ?int $adults = null, ?int $children = null, ?int $infants = null, ?string $cabin = null, ?string $sort = null, ?string $currency = null, ?int $limit = null, ?int $offset = null, ?string $undefined = null, ?string $undefined = null, ?string $undefined = null): array
    {
        return $this->get('/search-v3', ['from' => $from, 'to' => $to, 'date_from' => $date_from, 'date_to' => $date_to, 'return_from' => $return_from, 'return_to' => $return_to, 'departure_from' => $departure_from, 'departure_to' => $departure_to, 'arrival_from' => $arrival_from, 'arrival_to' => $arrival_to, 'min_price' => $min_price, 'max_price' => $max_price, 'max_stops' => $max_stops, 'adults' => $adults, 'children' => $children, 'infants' => $infants, 'cabin' => $cabin, 'sort' => $sort, 'currency' => $currency, 'limit' => $limit, 'offset' => $offset, undefined => $undefined, undefined => $undefined, undefined => $undefined]);
    }

    /**
     * @param array<string, scalar|null> $params
     * @return array<string, mixed>
     */
    private function get(string $path, array $params): array
    {
        $query = [];
        foreach ($params as $name => $value) {
            if ($value === null) {
                continue;
            }
            $text = is_bool($value) ? ($value ? 'true' : 'false') : (string) $value;
            $token = '{' . $name . '}';
            if (str_contains($path, $token)) {
                $path = str_replace($token, rawurlencode($text), $path);
            } else {
                $query[$name] = $text;
            }
        }
        $curl = curl_init($this->baseUrl . $path . ($query ? '?' . http_build_query($query) : ''));
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_USERAGENT => 'kiwi-unofficial-sdk/0.1.0 (php)',
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $this->apiKey, 'Accept: application/json'],
        ]);
        $body = curl_exec($curl);
        if ($body === false) {
            throw new ApiError(0, 'network_error', curl_error($curl));
        }
        $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $data = json_decode($body, true);
        if ($status >= 400) {
            $detail = is_array($data) ? $data : [];
            throw new ApiError(
                $status,
                (string) ($detail['error'] ?? 'http_error'),
                (string) ($detail['message'] ?? substr($body, 0, 200)),
            );
        }
        return is_array($data) ? $data : [];
    }
}
