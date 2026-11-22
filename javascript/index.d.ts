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
}

export interface PlacesIdParams {
  /**
   * A Kiwi location id: an airport code (CRL), a city id (london_gb), a country code
   * (GB), a subdivision (FL_US), a continent (europe), or a search id from /places-v2 or
   * /explore (Airport:CRL, City:london_gb)
   */
  "id": string;
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
}

export declare class KiwiClient {
  constructor(options?: ClientOptions);
  request(path: string, params?: Record<string, unknown>, required?: string[]): Promise<Record<string, any>>;
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
   */
  explore(params: ExploreParams): Promise<Record<string, any>>;
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
   */
  placesId(params: PlacesIdParams): Promise<Record<string, any>>;
  /**
   * List published city-pair routes from Kiwi route sitemaps. Params: page,
   * limit/offset.
   *
   * Parameters:
   *   page (integer): Which route sub-sitemap to read (0-based). Kiwi splits ~50k
   *     routes per file across many files
   *   limit (integer): Max routes per page
   *   offset (integer): Pagination offset within the sub-sitemap
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
   */
  searchV2(params: SearchV2Params): Promise<Record<string, any>>;
}
