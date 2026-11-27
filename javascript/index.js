// Unofficial Kiwi.com API client for JavaScript and TypeScript.
// Not affiliated with Kiwi.com. Endpoint reference: https://maviapi.com/apis/kiwi

export const DEMO_KEY = "mvk_test_playground_5f3c1a8d";

/** An error status answered by the API. */
export class ApiError extends Error {
  constructor(status, code, message) {
    super(`${status} ${code}: ${message}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class KiwiClient {
  /**
   * With no apiKey it uses the MAVIAPI_API_KEY environment variable, then the
   * shared demo key.
   */
  constructor({ apiKey, baseUrl, timeout = 120_000, fetch: fetcher } = {}) {
    const env = globalThis.process?.env ?? {};
    this.apiKey = apiKey || env.MAVIAPI_API_KEY || DEMO_KEY;
    let root = baseUrl || env.MAVIAPI_BASE_URL || "https://api.maviapi.com";
    while (root.endsWith("/")) root = root.slice(0, -1);
    this.baseUrl = root + "/v1/sites/kiwi";
    this.timeout = timeout;
    this.fetch = fetcher ?? ((...args) => globalThis.fetch(...args));
  }

  /**
   * Airports within a radius of a lat/lon point, nearest first, with distance, city,
   * country and a popularity hint.
   */
  airportsNear(params) {
    return this.request("/airports-near", params, ["lat", "lon"]);
  }

  /**
   * Cheapest flight to every destination city from a place, like the site's 'anywhere'
   * search: one row per city with price, airport and times. Narrow by country, region or
   * continent, dates, price and stops; expand attaches full itineraries.
   */
  explore(params) {
    return this.request("/explore", params, ["from"]);
  }

  /**
   * Cheapest flight to every destination city from a place, like the site's 'anywhere'
   * search, with that flight's airlines, stops, duration, local departure and arrival
   * times and booking link on every row. Same filters and destination fields as
   * /explore; paged by cursor.
   */
  exploreV2(params) {
    return this.request("/explore-v2", params, ["from"]);
  }

  /**
   * Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA
   * code. Params: q, type, limit/offset.
   */
  places(params = {}) {
    return this.request("/places", params, []);
  }

  /**
   * Search Kiwi locations of every type by name or code, with an optional type filter.
   * Every row carries its country (airports included) and a search_id for /search-v2.
   */
  placesV2(params) {
    return this.request("/places-v2", params, ["q"]);
  }

  /**
   * One Kiwi location by id or code: name, type, codes, city, country, region,
   * continent, time zone, population and coordinates.
   */
  placesById(params) {
    return this.request("/places/{id}", params, ["id"]);
  }

  /**
   * Check one itinerary from /search-v2 or /search-v3 again before booking: whether it
   * is still available, its current price for the given passengers and currency, a fresh
   * booking link, fetched_at and expires_at. Never cached.
   */
  revalidate(params) {
    return this.request("/revalidate", params, ["id"]);
  }

  /**
   * List published city-pair routes from Kiwi route sitemaps. Params: page,
   * limit/offset.
   */
  routes(params = {}) {
    return this.request("/routes", params, []);
  }

  /**
   * Flight search: itineraries with prices, airlines, routes and departure/arrival
   * times. from/to accept place names, IATA codes or Kiwi ids; date/return_date,
   * adults/children/infants, cabin, sort, currency, limit/offset.
   */
  search(params) {
    return this.request("/search", params, ["from", "to"]);
  }

  /**
   * Flight search with departure and return date windows, a price range and a stop
   * limit. from/to take codes, names of any place type, countries, regions, continents,
   * or to=anywhere; unclear values answer 400 with candidates. At most 50 itineraries
   * per search: narrow it to reach others.
   */
  searchV2(params) {
    return this.request("/search-v2", params, ["from", "to"]);
  }

  /**
   * Flight search with date windows plus several origins and destinations
   * (from=BRU,CRL), local departure and arrival time windows, and every itinerary the
   * search has, paged by cursor, with total_estimate. Each itinerary names the origin
   * and destination it matched and when its price expires.
   */
  searchV3(params) {
    return this.request("/search-v3", params, ["from", "to"]);
  }

  /** GET one endpoint path. Parameters named in the path go there, the rest in the query. */
  async request(path, params = {}, required = []) {
    for (const name of required) {
      if (params[name] == null) throw new TypeError(`Missing required parameter: ${name}`);
    }
    const query = new URLSearchParams();
    for (const [name, value] of Object.entries(params)) {
      if (value == null) continue;
      const token = `{${name}}`;
      if (path.includes(token)) path = path.replace(token, encodeURIComponent(String(value)));
      else query.set(name, String(value));
    }
    const search = query.toString();
    const response = await this.fetch(this.baseUrl + path + (search ? `?${search}` : ""), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        "User-Agent": "kiwi-unofficial-sdk/0.1.0 (javascript)",
      },
      signal: AbortSignal.timeout(this.timeout),
    });
    const text = await response.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch {}
    if (!response.ok) {
      throw new ApiError(response.status, body?.error ?? "http_error", body?.message ?? text.slice(0, 200));
    }
    return body;
  }
}
