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
   * Airports within a radius of a point, nearest first, with distance, city, country,
   * time zone and Kiwi popularity.
   *
   * Each successful request uses 5 credits.
   */
  airportsNear(params = {}) {
    return this.request("/airports-near", params, []);
  }

  /**
   * The cheapest flight to every destination city from a place, like kiwi.com's
   * 'anywhere' search: one row per city with price, origin and destination airports,
   * local and UTC times and, for round trips, nights and return date. expand attaches
   * the top 3 full itineraries for the first N cities.
   *
   * Each successful request uses 5 credits.
   */
  explore(params = {}) {
    return this.request("/explore", params, []);
  }

  /**
   * The cheapest flight to every destination city from a place, like kiwi.com's
   * 'anywhere' search, with that flight on every row: airlines, stops, duration, local
   * and UTC departure and arrival, segments and booking link (and the return leg for
   * round trips). Same filters and destination fields as /explore; at most the first 200
   * cities.
   *
   * Each successful request uses 5 credits.
   */
  exploreV2(params = {}) {
    return this.request("/explore-v2", params, []);
  }

  /**
   * Kiwi locations of one type matching a name or IATA code, best match first.
   *
   * Each successful request uses 5 credits.
   */
  places(params = {}) {
    return this.request("/places", params, []);
  }

  /**
   * Kiwi locations of every type matching a name or code, best match first; each row has
   * its country and a search_id for the flight searches.
   *
   * Each successful request uses 5 credits.
   */
  placesV2(params = {}) {
    return this.request("/places-v2", params, []);
  }

  /**
   * One Kiwi location by id or code: name, type, codes, city, country, region,
   * continent, time zone, population and coordinates.
   *
   * Each successful request uses 5 credits.
   */
  placesById(params) {
    return this.request("/places/{id}", params, ["id"]);
  }

  /**
   * Checks one itinerary from /search, /search-v2 or /search-v3 again before booking:
   * whether the same flights are still on sale, their current total price for these
   * passengers and currency, a fresh booking link and segments, fetched_at and
   * expires_at. Never cached.
   *
   * Each successful request uses 5 credits.
   */
  revalidate(params = {}) {
    return this.request("/revalidate", params, []);
  }

  /**
   * Published city-pair routes (cheap-flights pages) from one of Kiwi's route sitemaps,
   * in sitemap order.
   *
   * Each successful request uses 5 credits.
   */
  routes(params = {}) {
    return this.request("/routes", params, []);
  }

  /**
   * Flight itineraries for one departure day (and optional return day): prices,
   * airlines, segments, local and UTC times and booking links, as kiwi.com ranks them
   * (at most 25 per search).
   *
   * Each successful request uses 5 credits.
   */
  search(params = {}) {
    return this.request("/search", params, []);
  }

  /**
   * Flight itineraries for departure (and optional return) date windows, with prices,
   * segments, airlines, local and UTC times and booking links. The list holds at most
   * cap (50) itineraries, in the order of sort; capped is true when kiwi.com had more
   * for the search than were returned, so narrow the search (dates, places, price,
   * stops) to see the rest.
   *
   * Each successful request uses 5 credits.
   */
  searchV2(params = {}) {
    return this.request("/search-v2", params, []);
  }

  /**
   * Every itinerary kiwi.com has for up to 3 origins and 3 destinations over departure
   * (and return) date windows, with local departure and arrival time windows. Each
   * itinerary names the origin and destination it matched (origin, destination), its
   * fetch time and when its quoted price expires; total_estimate counts them and
   * total_exact says whether none of the underlying searches was cut off.
   *
   * Each successful request uses 5 credits.
   */
  searchV3(params = {}) {
    return this.request("/search-v3", params, []);
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
