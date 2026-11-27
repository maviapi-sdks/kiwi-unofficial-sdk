export declare const DEMO_KEY: string;

export interface ClientOptions {
  /** Your maviapi API key. Default: the MAVIAPI_API_KEY environment variable, then the shared demo key. */
  apiKey?: string;
  baseUrl?: string;
  /** Milliseconds. Default 120000. */
  timeout?: number;
  fetch?: typeof fetch;
}

/** An error status answered by the API. */
export declare class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string);
}

export interface AirportsNearParams {
  /**
   * Latitude of the point, in decimal degrees
   */
  "lat": number;
  /**
   * Longitude of the point, in decimal degrees
   */
  "lon": number;
  /**
   * Search radius in km (default 150, max 500)
   */
  "radius_km"?: number;
  /**
   * true also returns airports Kiwi sells no flights from (small airfields, military
   * fields). One of: false, true
   */
  "include_inactive"?: string;
  /**
   * Airports per page. The source returns at most the 50 nearest airports per call
   * (data.capped); narrow radius_km to stay under it
   */
  "limit"?: number;
  /**
   * Offset within the at most 50 nearest airports of a call
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export interface ExploreParams {
  /**
   * Origin. Codes first: a 3-letter code is an airport (else a metro city code such as
   * LON), an upper-case 2-letter code a country (else a continent such as EU). Then a
   * name of any place type (city, airport, subdivision, country, region, continent),
   * case and accent insensitive, or a search id from /places-v2 (e.g. 'Airport:CRL',
   * 'Country:TR'). An unclear or unknown value answers 400 with candidates
   */
  "from": string;
  /**
   * Optional broad scope for the destinations: a country, subdivision, region or
   * continent (code, name or search id, same rules as from). Omit or 'anywhere' for
   * every destination
   */
  "to"?: string;
  /**
   * Start of the departure date window, YYYY-MM-DD. Defaults to 30 days from today
   */
  "date_from"?: string;
  /**
   * End of the departure date window, YYYY-MM-DD (inclusive). Defaults to date_from (a
   * single day)
   */
  "date_to"?: string;
  /**
   * Start of the return date window, YYYY-MM-DD. Set it for a round trip; omit for
   * one-way
   */
  "return_from"?: string;
  /**
   * End of the return date window, YYYY-MM-DD (inclusive). Defaults to return_from
   */
  "return_to"?: string;
  /**
   * Lowest price per destination, in `currency`
   */
  "min_price"?: number;
  /**
   * Highest price per destination, in `currency`
   */
  "max_price"?: number;
  /**
   * Most stops per leg (0 = direct only). Omit for any. One of: 0, 1, 2, 3
   */
  "max_stops"?: number;
  /**
   * Adult passengers (1-9)
   */
  "adults"?: number;
  /**
   * Child passengers (0-8)
   */
  "children"?: number;
  /**
   * Infant passengers (at most one per adult)
   */
  "infants"?: number;
  /**
   * Which flight represents each city and the order of the cities: PRICE = cheapest
   * first, POPULARITY = the site's popular destinations first (the set differs a little
   * per sort). One of: PRICE, POPULARITY, QUALITY, DURATION, DATE
   */
  "sort"?: string;
  /**
   * Price currency (3-letter ISO code); min_price and max_price use it too
   */
  "currency"?: string;
  /**
   * Also attach the top 3 itineraries (segments, airlines, booking link) for the
   * destinations ranked 1 to N (on whichever page they fall). 0 = none. One of: 0, 1, 2,
   * 3, 4, 5
   */
  "expand"?: number;
  /**
   * Destinations per page (max 1000). Every reachable city is returned, see
   * pagination.total
   */
  "limit"?: number;
  /**
   * Pagination offset over every destination city
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export interface ExploreV2Params {
  /**
   * Origin. Codes first: a 3-letter code is an airport (else a metro city code such as
   * LON), an upper-case 2-letter code a country (else a continent such as EU). Then a
   * name of any place type (city, airport, subdivision, country, region, continent),
   * case and accent insensitive, or a search id from /places-v2 (e.g. 'Airport:CRL',
   * 'Country:TR'). An unclear or unknown value answers 400 with candidates
   */
  "from": string;
  /**
   * Optional broad scope for the destinations: a country, subdivision, region or
   * continent (code, name or search id, same rules as from). Omit or 'anywhere' for
   * every destination
   */
  "to"?: string;
  /**
   * Start of the departure date window, YYYY-MM-DD. Defaults to 30 days from today
   */
  "date_from"?: string;
  /**
   * End of the departure date window, YYYY-MM-DD (inclusive). Defaults to date_from (a
   * single day)
   */
  "date_to"?: string;
  /**
   * Start of the return date window, YYYY-MM-DD. Set it for a round trip; omit for
   * one-way
   */
  "return_from"?: string;
  /**
   * End of the return date window, YYYY-MM-DD (inclusive). Defaults to return_from
   */
  "return_to"?: string;
  /**
   * Lowest price per destination, in `currency`
   */
  "min_price"?: number;
  /**
   * Highest price per destination, in `currency`
   */
  "max_price"?: number;
  /**
   * Most stops per leg (0 = direct only). Omit for any. One of: 0, 1, 2, 3
   */
  "max_stops"?: number;
  /**
   * Adult passengers (1-9)
   */
  "adults"?: number;
  /**
   * Child passengers (0-8)
   */
  "children"?: number;
  /**
   * Infant passengers (at most one per adult)
   */
  "infants"?: number;
  /**
   * Order of the cities (and which flight sets the destination price): PRICE = cheapest
   * first, POPULARITY = the site's popular destinations first. The flight on each row is
   * always that city's cheapest itinerary. One of: PRICE, POPULARITY, QUALITY, DURATION,
   * DATE
   */
  "sort"?: string;
  /**
   * Price currency (3-letter ISO code); min_price and max_price use it too
   */
  "currency"?: string;
  /**
   * Destinations per page (max 200). Every reachable city is returned, see
   * pagination.total; walk the rest with cursor
   */
  "limit"?: number;
  /**
   * Pagination offset over every destination city
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export interface PlacesParams {
  /**
   * Search term (place name or IATA code)
   */
  "q"?: string;
  /**
   * Location type to search. One of: city, airport, country, region, subdivision
   */
  "type"?: string;
  /**
   * Max places per page
   */
  "limit"?: number;
  /**
   * Pagination offset
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export interface PlacesV2Params {
  /**
   * Place name or code (case and accent insensitive)
   */
  "q": string;
  /**
   * Optional filter: one type or a comma list of city, airport, country, subdivision,
   * region, continent, autonomous_territory, special, tourist_region. Omit to search
   * every type. One of: city, airport, country, subdivision, region, continent,
   * autonomous_territory, special, tourist_region
   */
  "type"?: string;
  /**
   * Places per page (max 1000)
   */
  "limit"?: number;
  /**
   * Pagination offset within the at most 1000 places of a query (see data.cap)
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export interface PlacesByIdParams {
  /**
   * A Kiwi location id: an airport code (CRL), a city id (london_gb), a country code
   * (GB), a subdivision (FL_US), a continent (europe), or a search id from /places-v2 or
   * /explore (Airport:CRL, City:london_gb)
   */
  "id": string;
  undefined?: string;
}

export interface RevalidateParams {
  /**
   * The itinerary id (`id`) of a row from /search-v2 or /search-v3, one-way or return
   */
  "id": string;
  /**
   * Price currency (3-letter ISO code). Pass the currency of the search the id came from
   * to compare with quoted_price
   */
  "currency"?: string;
  /**
   * Adult passengers (1-9)
   */
  "adults"?: number;
  /**
   * Child passengers (0-8)
   */
  "children"?: number;
  /**
   * Infant passengers, at most one per adult
   */
  "infants"?: number;
  undefined?: string;
}

export interface RoutesParams {
  /**
   * Which route sub-sitemap to read (0-based). Kiwi splits ~50k routes per file across
   * many files
   */
  "page"?: number;
  /**
   * Max routes per page
   */
  "limit"?: number;
  /**
   * Pagination offset within the sub-sitemap
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export interface SearchParams {
  /**
   * Origin: place name, IATA code or Kiwi id (e.g. 'london', 'LHR', 'City:london_gb')
   */
  "from": string;
  /**
   * Destination: place name, IATA code or Kiwi id
   */
  "to": string;
  /**
   * Outbound departure date, YYYY-MM-DD. Defaults to ~30 days out
   */
  "date"?: string;
  /**
   * Optional inbound date, YYYY-MM-DD. Set it for a round trip; omit for one-way
   */
  "return_date"?: string;
  /**
   * Adult passengers (1-9)
   */
  "adults"?: number;
  /**
   * Child passengers (0-9)
   */
  "children"?: number;
  /**
   * Infant passengers (0-9)
   */
  "infants"?: number;
  /**
   * Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
   */
  "cabin"?: string;
  /**
   * Result ordering. One of: QUALITY, PRICE, DURATION
   */
  "sort"?: string;
  /**
   * Price currency (ISO code)
   */
  "currency"?: string;
  /**
   * Max itineraries per page
   */
  "limit"?: number;
  /**
   * Pagination offset
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export interface SearchV2Params {
  /**
   * Origin. Codes first: a 3-letter code is an airport (else a metro city code such as
   * LON), an upper-case 2-letter code a country (else a continent such as EU). Then a
   * name of any place type (city, airport, subdivision, country, region, continent),
   * case and accent insensitive, or a search id from /places-v2 (e.g. 'Airport:CRL',
   * 'Country:TR'). An unclear or unknown value answers 400 with candidates
   */
  "from": string;
  /**
   * Destination, same rules as from, plus 'anywhere' for every destination
   */
  "to": string;
  /**
   * Start of the departure date window, YYYY-MM-DD. Defaults to 30 days from today
   */
  "date_from"?: string;
  /**
   * End of the departure date window, YYYY-MM-DD (inclusive). Defaults to date_from (a
   * single day)
   */
  "date_to"?: string;
  /**
   * Start of the return date window, YYYY-MM-DD. Set it for a round trip; omit for
   * one-way
   */
  "return_from"?: string;
  /**
   * End of the return date window, YYYY-MM-DD (inclusive). Defaults to return_from
   */
  "return_to"?: string;
  /**
   * Lowest total price, in `currency`
   */
  "min_price"?: number;
  /**
   * Highest total price, in `currency`
   */
  "max_price"?: number;
  /**
   * Most stops per leg (0 = direct only). Omit for any. One of: 0, 1, 2, 3
   */
  "max_stops"?: number;
  /**
   * Adult passengers (1-9)
   */
  "adults"?: number;
  /**
   * Child passengers (0-8)
   */
  "children"?: number;
  /**
   * Infant passengers (at most one per adult)
   */
  "infants"?: number;
  /**
   * Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
   */
  "cabin"?: string;
  /**
   * Which 50 itineraries the search keeps, and their order. One of: QUALITY, PRICE,
   * DURATION
   */
  "sort"?: string;
  /**
   * Price currency (3-letter ISO code); min_price and max_price use it too
   */
  "currency"?: string;
  /**
   * Itineraries per page. A search returns at most 50 itineraries (see data.cap)
   */
  "limit"?: number;
  /**
   * Offset within the at most 50 itineraries of this search. Rows past 50 are not
   * reachable by offset: narrow the dates, price or stops instead
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export interface SearchV3Params {
  /**
   * Origin: one place or a comma list of up to 3 (BRU,CRL or LON,STN). Each item follows
   * the /search-v2 rules: a 3-letter code is an airport (else a metro city code such as
   * LON), an upper-case 2-letter code a country (else a continent), then a name of any
   * place type, case and accent insensitive, or a search id from /places-v2
   * ('Airport:CRL'). Names that contain a comma need their search id. An unclear item
   * answers 400 with candidates
   */
  "from": string;
  /**
   * Destination: one place or a comma list of up to 3, same rules as from, or 'anywhere'
   * alone for every destination
   */
  "to": string;
  /**
   * Start of the departure date window, YYYY-MM-DD. Defaults to 30 days from today
   */
  "date_from"?: string;
  /**
   * End of the departure date window, YYYY-MM-DD (inclusive, at most 92 days after
   * date_from). Defaults to date_from (a single day)
   */
  "date_to"?: string;
  /**
   * Start of the return date window, YYYY-MM-DD. Set it for a round trip; omit for
   * one-way
   */
  "return_from"?: string;
  /**
   * End of the return date window, YYYY-MM-DD (inclusive). Defaults to return_from
   */
  "return_to"?: string;
  /**
   * Earliest local departure time of the outbound leg, HH:MM (00:00 to 23:59), at the
   * first departure airport. A window cannot cross midnight
   */
  "departure_from"?: string;
  /**
   * Latest local departure time of the outbound leg, HH:MM (inclusive, 00:00 to 24:00),
   * at the first departure airport. A window cannot cross midnight
   */
  "departure_to"?: string;
  /**
   * Earliest local arrival time of the outbound leg, HH:MM (00:00 to 23:59), at the
   * final arrival airport. A window cannot cross midnight
   */
  "arrival_from"?: string;
  /**
   * Latest local arrival time of the outbound leg, HH:MM (inclusive, 00:00 to 24:00), at
   * the final arrival airport. A window cannot cross midnight
   */
  "arrival_to"?: string;
  /**
   * Lowest total price, in `currency`
   */
  "min_price"?: number;
  /**
   * Highest total price, in `currency`
   */
  "max_price"?: number;
  /**
   * Most stops per leg (0 = direct only). Omit for any. One of: 0, 1, 2, 3
   */
  "max_stops"?: number;
  /**
   * Adult passengers (1-9)
   */
  "adults"?: number;
  /**
   * Child passengers (0-8)
   */
  "children"?: number;
  /**
   * Infant passengers (at most one per adult)
   */
  "infants"?: number;
  /**
   * Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
   */
  "cabin"?: string;
  /**
   * Order of the itineraries. PRICE and DURATION sort all of them; QUALITY keeps the
   * site's own ranking inside each part of the search (the best of each first), then
   * price. One of: QUALITY, PRICE, DURATION
   */
  "sort"?: string;
  /**
   * Price currency (3-letter ISO code); min_price and max_price use it too
   */
  "currency"?: string;
  /**
   * Itineraries per page. Every itinerary of the search is reachable: follow
   * pagination.next_cursor (or offset) while pagination.has_more is true
   */
  "limit"?: number;
  /**
   * Offset into all the itineraries of the search
   */
  "offset"?: number;
  undefined?: string;
  undefined?: string;
  undefined?: string;
}

export declare class KiwiClient {
  constructor(options?: ClientOptions);
  request(path: string, params?: Record<string, unknown>, required?: string[]): Promise<Record<string, any>>;
  /**
   * Airports within a radius of a lat/lon point, nearest first, with distance, city,
   * country and a popularity hint.
   *
   * Parameters:
   *   lat (number, required): Latitude of the point, in decimal degrees
   *   lon (number, required): Longitude of the point, in decimal degrees
   *   radius_km (number): Search radius in km (default 150, max 500)
   *   include_inactive (string): true also returns airports Kiwi sells no flights from
   *     (small airfields, military fields). One of: false, true
   *   limit (integer): Airports per page. The source returns at most the 50 nearest
   *     airports per call (data.capped); narrow radius_km to stay under it
   *   offset (integer): Offset within the at most 50 nearest airports of a call
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  airportsNear(params: AirportsNearParams): Promise<Record<string, any>>;
  /**
   * Cheapest flight to every destination city from a place, like the site's 'anywhere'
   * search: one row per city with price, airport and times. Narrow by country, region or
   * continent, dates, price and stops; expand attaches full itineraries.
   *
   * Parameters:
   *   from (string, required): Origin. Codes first: a 3-letter code is an airport
   *     (else a metro city code such as LON), an upper-case 2-letter code a country
   *     (else a continent such as EU). Then a name of any place type (city, airport,
   *     subdivision, country, region, continent), case and accent insensitive, or a
   *     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
   *     unknown value answers 400 with candidates
   *   to (string): Optional broad scope for the destinations: a country, subdivision,
   *     region or continent (code, name or search id, same rules as from). Omit or
   *     'anywhere' for every destination
   *   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
   *     30 days from today
   *   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
   *     Defaults to date_from (a single day)
   *   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
   *     round trip; omit for one-way
   *   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
   *     Defaults to return_from
   *   min_price (number): Lowest price per destination, in `currency`
   *   max_price (number): Highest price per destination, in `currency`
   *   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
   *     0, 1, 2, 3
   *   adults (integer): Adult passengers (1-9)
   *   children (integer): Child passengers (0-8)
   *   infants (integer): Infant passengers (at most one per adult)
   *   sort (string): Which flight represents each city and the order of the cities:
   *     PRICE = cheapest first, POPULARITY = the site's popular destinations first (the
   *     set differs a little per sort). One of: PRICE, POPULARITY, QUALITY, DURATION,
   *     DATE
   *   currency (string): Price currency (3-letter ISO code); min_price and max_price
   *     use it too
   *   expand (integer): Also attach the top 3 itineraries (segments, airlines, booking
   *     link) for the destinations ranked 1 to N (on whichever page they fall). 0 =
   *     none. One of: 0, 1, 2, 3, 4, 5
   *   limit (integer): Destinations per page (max 1000). Every reachable city is
   *     returned, see pagination.total
   *   offset (integer): Pagination offset over every destination city
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  explore(params: ExploreParams): Promise<Record<string, any>>;
  /**
   * Cheapest flight to every destination city from a place, like the site's 'anywhere'
   * search, with that flight's airlines, stops, duration, local departure and arrival
   * times and booking link on every row. Same filters and destination fields as
   * /explore; paged by cursor.
   *
   * Parameters:
   *   from (string, required): Origin. Codes first: a 3-letter code is an airport
   *     (else a metro city code such as LON), an upper-case 2-letter code a country
   *     (else a continent such as EU). Then a name of any place type (city, airport,
   *     subdivision, country, region, continent), case and accent insensitive, or a
   *     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
   *     unknown value answers 400 with candidates
   *   to (string): Optional broad scope for the destinations: a country, subdivision,
   *     region or continent (code, name or search id, same rules as from). Omit or
   *     'anywhere' for every destination
   *   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
   *     30 days from today
   *   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
   *     Defaults to date_from (a single day)
   *   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
   *     round trip; omit for one-way
   *   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
   *     Defaults to return_from
   *   min_price (number): Lowest price per destination, in `currency`
   *   max_price (number): Highest price per destination, in `currency`
   *   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
   *     0, 1, 2, 3
   *   adults (integer): Adult passengers (1-9)
   *   children (integer): Child passengers (0-8)
   *   infants (integer): Infant passengers (at most one per adult)
   *   sort (string): Order of the cities (and which flight sets the destination
   *     price): PRICE = cheapest first, POPULARITY = the site's popular destinations
   *     first. The flight on each row is always that city's cheapest itinerary. One of:
   *     PRICE, POPULARITY, QUALITY, DURATION, DATE
   *   currency (string): Price currency (3-letter ISO code); min_price and max_price
   *     use it too
   *   limit (integer): Destinations per page (max 200). Every reachable city is
   *     returned, see pagination.total; walk the rest with cursor
   *   offset (integer): Pagination offset over every destination city
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  exploreV2(params: ExploreV2Params): Promise<Record<string, any>>;
  /**
   * Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA
   * code. Params: q, type, limit/offset.
   *
   * Parameters:
   *   q (string): Search term (place name or IATA code)
   *   type (string): Location type to search. One of: city, airport, country, region,
   *     subdivision
   *   limit (integer): Max places per page
   *   offset (integer): Pagination offset
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  places(params?: PlacesParams): Promise<Record<string, any>>;
  /**
   * Search Kiwi locations of every type by name or code, with an optional type filter.
   * Every row carries its country (airports included) and a search_id for /search-v2.
   *
   * Parameters:
   *   q (string, required): Place name or code (case and accent insensitive)
   *   type (string): Optional filter: one type or a comma list of city, airport,
   *     country, subdivision, region, continent, autonomous_territory, special,
   *     tourist_region. Omit to search every type. One of: city, airport, country,
   *     subdivision, region, continent, autonomous_territory, special, tourist_region
   *   limit (integer): Places per page (max 1000)
   *   offset (integer): Pagination offset within the at most 1000 places of a query
   *     (see data.cap)
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  placesV2(params: PlacesV2Params): Promise<Record<string, any>>;
  /**
   * One Kiwi location by id or code: name, type, codes, city, country, region,
   * continent, time zone, population and coordinates.
   *
   * Parameters:
   *   id (string, required): A Kiwi location id: an airport code (CRL), a city id
   *     (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe),
   *     or a search id from /places-v2 or /explore (Airport:CRL, City:london_gb)
   *   undefined (string)
   */
  placesById(params: PlacesByIdParams): Promise<Record<string, any>>;
  /**
   * Check one itinerary from /search-v2 or /search-v3 again before booking: whether it
   * is still available, its current price for the given passengers and currency, a fresh
   * booking link, fetched_at and expires_at. Never cached.
   *
   * Parameters:
   *   id (string, required): The itinerary id (`id`) of a row from /search-v2 or
   *     /search-v3, one-way or return
   *   currency (string): Price currency (3-letter ISO code). Pass the currency of the
   *     search the id came from to compare with quoted_price
   *   adults (integer): Adult passengers (1-9)
   *   children (integer): Child passengers (0-8)
   *   infants (integer): Infant passengers, at most one per adult
   *   undefined (string)
   */
  revalidate(params: RevalidateParams): Promise<Record<string, any>>;
  /**
   * List published city-pair routes from Kiwi route sitemaps. Params: page,
   * limit/offset.
   *
   * Parameters:
   *   page (integer): Which route sub-sitemap to read (0-based). Kiwi splits ~50k
   *     routes per file across many files
   *   limit (integer): Max routes per page
   *   offset (integer): Pagination offset within the sub-sitemap
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  routes(params?: RoutesParams): Promise<Record<string, any>>;
  /**
   * Flight search: itineraries with prices, airlines, routes and departure/arrival
   * times. from/to accept place names, IATA codes or Kiwi ids; date/return_date,
   * adults/children/infants, cabin, sort, currency, limit/offset.
   *
   * Parameters:
   *   from (string, required): Origin: place name, IATA code or Kiwi id (e.g.
   *     'london', 'LHR', 'City:london_gb')
   *   to (string, required): Destination: place name, IATA code or Kiwi id
   *   date (string): Outbound departure date, YYYY-MM-DD. Defaults to ~30 days out
   *   return_date (string): Optional inbound date, YYYY-MM-DD. Set it for a round
   *     trip; omit for one-way
   *   adults (integer): Adult passengers (1-9)
   *   children (integer): Child passengers (0-9)
   *   infants (integer): Infant passengers (0-9)
   *   cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
   *   sort (string): Result ordering. One of: QUALITY, PRICE, DURATION
   *   currency (string): Price currency (ISO code)
   *   limit (integer): Max itineraries per page
   *   offset (integer): Pagination offset
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  search(params: SearchParams): Promise<Record<string, any>>;
  /**
   * Flight search with departure and return date windows, a price range and a stop
   * limit. from/to take codes, names of any place type, countries, regions, continents,
   * or to=anywhere; unclear values answer 400 with candidates. At most 50 itineraries
   * per search: narrow it to reach others.
   *
   * Parameters:
   *   from (string, required): Origin. Codes first: a 3-letter code is an airport
   *     (else a metro city code such as LON), an upper-case 2-letter code a country
   *     (else a continent such as EU). Then a name of any place type (city, airport,
   *     subdivision, country, region, continent), case and accent insensitive, or a
   *     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
   *     unknown value answers 400 with candidates
   *   to (string, required): Destination, same rules as from, plus 'anywhere' for
   *     every destination
   *   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
   *     30 days from today
   *   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
   *     Defaults to date_from (a single day)
   *   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
   *     round trip; omit for one-way
   *   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
   *     Defaults to return_from
   *   min_price (number): Lowest total price, in `currency`
   *   max_price (number): Highest total price, in `currency`
   *   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
   *     0, 1, 2, 3
   *   adults (integer): Adult passengers (1-9)
   *   children (integer): Child passengers (0-8)
   *   infants (integer): Infant passengers (at most one per adult)
   *   cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
   *   sort (string): Which 50 itineraries the search keeps, and their order. One of:
   *     QUALITY, PRICE, DURATION
   *   currency (string): Price currency (3-letter ISO code); min_price and max_price
   *     use it too
   *   limit (integer): Itineraries per page. A search returns at most 50 itineraries
   *     (see data.cap)
   *   offset (integer): Offset within the at most 50 itineraries of this search. Rows
   *     past 50 are not reachable by offset: narrow the dates, price or stops instead
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  searchV2(params: SearchV2Params): Promise<Record<string, any>>;
  /**
   * Flight search with date windows plus several origins and destinations
   * (from=BRU,CRL), local departure and arrival time windows, and every itinerary the
   * search has, paged by cursor, with total_estimate. Each itinerary names the origin
   * and destination it matched and when its price expires.
   *
   * Parameters:
   *   from (string, required): Origin: one place or a comma list of up to 3 (BRU,CRL
   *     or LON,STN). Each item follows the /search-v2 rules: a 3-letter code is an
   *     airport (else a metro city code such as LON), an upper-case 2-letter code a
   *     country (else a continent), then a name of any place type, case and accent
   *     insensitive, or a search id from /places-v2 ('Airport:CRL'). Names that contain
   *     a comma need their search id. An unclear item answers 400 with candidates
   *   to (string, required): Destination: one place or a comma list of up to 3, same
   *     rules as from, or 'anywhere' alone for every destination
   *   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
   *     30 days from today
   *   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive, at
   *     most 92 days after date_from). Defaults to date_from (a single day)
   *   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
   *     round trip; omit for one-way
   *   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
   *     Defaults to return_from
   *   departure_from (string): Earliest local departure time of the outbound leg,
   *     HH:MM (00:00 to 23:59), at the first departure airport. A window cannot cross
   *     midnight
   *   departure_to (string): Latest local departure time of the outbound leg, HH:MM
   *     (inclusive, 00:00 to 24:00), at the first departure airport. A window cannot
   *     cross midnight
   *   arrival_from (string): Earliest local arrival time of the outbound leg, HH:MM
   *     (00:00 to 23:59), at the final arrival airport. A window cannot cross midnight
   *   arrival_to (string): Latest local arrival time of the outbound leg, HH:MM
   *     (inclusive, 00:00 to 24:00), at the final arrival airport. A window cannot cross
   *     midnight
   *   min_price (number): Lowest total price, in `currency`
   *   max_price (number): Highest total price, in `currency`
   *   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
   *     0, 1, 2, 3
   *   adults (integer): Adult passengers (1-9)
   *   children (integer): Child passengers (0-8)
   *   infants (integer): Infant passengers (at most one per adult)
   *   cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
   *   sort (string): Order of the itineraries. PRICE and DURATION sort all of them;
   *     QUALITY keeps the site's own ranking inside each part of the search (the best of
   *     each first), then price. One of: QUALITY, PRICE, DURATION
   *   currency (string): Price currency (3-letter ISO code); min_price and max_price
   *     use it too
   *   limit (integer): Itineraries per page. Every itinerary of the search is
   *     reachable: follow pagination.next_cursor (or offset) while pagination.has_more
   *     is true
   *   offset (integer): Offset into all the itineraries of the search
   *   undefined (string)
   *   undefined (string)
   *   undefined (string)
   */
  searchV3(params: SearchV3Params): Promise<Record<string, any>>;
}
