// Unofficial Kiwi.com API client for .NET.
// Not affiliated with Kiwi.com. Endpoint reference: https://maviapi.com/apis/kiwi

using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json;

namespace KiwiSdk;

/// <summary>An error status answered by the API.</summary>
public class ApiError : Exception
{
    public int Status { get; }
    public string Code { get; }

    public ApiError(int status, string code, string message) : base($"{status} {code}: {message}")
    {
        Status = status;
        Code = code;
    }
}

public class KiwiClient
{
    public const string DemoKey = "mvk_test_playground_5f3c1a8d";

    private readonly string _apiKey;
    private readonly string _baseUrl;
    private readonly HttpClient _http;

    /// <summary>
    /// With no apiKey it uses the MAVIAPI_API_KEY environment variable, then the
    /// shared demo key.
    /// </summary>
    public KiwiClient(string? apiKey = null, string? baseUrl = null, HttpClient? http = null)
    {
        _apiKey = First(apiKey, Environment.GetEnvironmentVariable("MAVIAPI_API_KEY"), DemoKey);
        var root = First(baseUrl, Environment.GetEnvironmentVariable("MAVIAPI_BASE_URL"), "https://api.maviapi.com");
        _baseUrl = root.TrimEnd('/') + "/v1/sites/kiwi";
        _http = http ?? new HttpClient { Timeout = TimeSpan.FromSeconds(120) };
    }

    // Cheapest flight to every destination city from a place, like the site's 'anywhere'
    // search: one row per city with price, airport and times. Narrow by country, region or
    // continent, dates, price and stops; expand attaches full itineraries.
    //
    // Parameters:
    //   from (string, required): Origin. Codes first: a 3-letter code is an airport
    //     (else a metro city code such as LON), an upper-case 2-letter code a country
    //     (else a continent such as EU). Then a name of any place type (city, airport,
    //     subdivision, country, region, continent), case and accent insensitive, or a
    //     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
    //     unknown value answers 400 with candidates
    //   to (string): Optional broad scope for the destinations: a country, subdivision,
    //     region or continent (code, name or search id, same rules as from). Omit or
    //     'anywhere' for every destination
    //   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
    //     30 days from today
    //   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
    //     Defaults to date_from (a single day)
    //   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
    //     round trip; omit for one-way
    //   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
    //     Defaults to return_from
    //   min_price (number): Lowest price per destination, in `currency`
    //   max_price (number): Highest price per destination, in `currency`
    //   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
    //     0, 1, 2, 3
    //   adults (integer): Adult passengers (1-9)
    //   children (integer): Child passengers (0-8)
    //   infants (integer): Infant passengers (at most one per adult)
    //   sort (string): Which flight represents each city and the order of the cities:
    //     PRICE = cheapest first, POPULARITY = the site's popular destinations first (the
    //     set differs a little per sort). One of: PRICE, POPULARITY, QUALITY, DURATION,
    //     DATE
    //   currency (string): Price currency (3-letter ISO code); min_price and max_price
    //     use it too
    //   expand (integer): Also attach the top 3 itineraries (segments, airlines, booking
    //     link) for the destinations ranked 1 to N (on whichever page they fall). 0 =
    //     none. One of: 0, 1, 2, 3, 4, 5
    //   limit (integer): Destinations per page (max 1000). Every reachable city is
    //     returned, see pagination.total
    //   offset (integer): Pagination offset over every destination city
    public Task<JsonElement> ExploreAsync(IDictionary<string, object?> parameters, CancellationToken cancellationToken = default) =>
        GetAsync("/explore", parameters, cancellationToken, "from");

    // Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA
    // code. Params: q, type, limit/offset.
    //
    // Parameters:
    //   q (string): Search term (place name or IATA code)
    //   type (string): Location type to search. One of: city, airport, country, region,
    //     subdivision
    //   limit (integer): Max places per page
    //   offset (integer): Pagination offset
    public Task<JsonElement> PlacesAsync(IDictionary<string, object?> parameters, CancellationToken cancellationToken = default) =>
        GetAsync("/places", parameters, cancellationToken);

    // Search Kiwi locations of every type by name or code, with an optional type filter.
    // Every row carries its country (airports included) and a search_id for /search-v2.
    //
    // Parameters:
    //   q (string, required): Place name or code (case and accent insensitive)
    //   type (string): Optional filter: one type or a comma list of city, airport,
    //     country, subdivision, region, continent, autonomous_territory, special,
    //     tourist_region. Omit to search every type. One of: city, airport, country,
    //     subdivision, region, continent, autonomous_territory, special, tourist_region
    //   limit (integer): Places per page (max 1000)
    //   offset (integer): Pagination offset within the at most 1000 places of a query
    //     (see data.cap)
    public Task<JsonElement> PlacesV2Async(IDictionary<string, object?> parameters, CancellationToken cancellationToken = default) =>
        GetAsync("/places-v2", parameters, cancellationToken, "q");

    // One Kiwi location by id or code: name, type, codes, city, country, region,
    // continent, time zone, population and coordinates.
    //
    // Parameters:
    //   id (string, required): A Kiwi location id: an airport code (CRL), a city id
    //     (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe),
    //     or a search id from /places-v2 or /explore (Airport:CRL, City:london_gb)
    public Task<JsonElement> PlacesIdAsync(IDictionary<string, object?> parameters, CancellationToken cancellationToken = default) =>
        GetAsync("/places/{id}", parameters, cancellationToken, "id");

    // List published city-pair routes from Kiwi route sitemaps. Params: page,
    // limit/offset.
    //
    // Parameters:
    //   page (integer): Which route sub-sitemap to read (0-based). Kiwi splits ~50k
    //     routes per file across many files
    //   limit (integer): Max routes per page
    //   offset (integer): Pagination offset within the sub-sitemap
    public Task<JsonElement> RoutesAsync(IDictionary<string, object?> parameters, CancellationToken cancellationToken = default) =>
        GetAsync("/routes", parameters, cancellationToken);

    // Flight search: itineraries with prices, airlines, routes and departure/arrival
    // times. from/to accept place names, IATA codes or Kiwi ids; date/return_date,
    // adults/children/infants, cabin, sort, currency, limit/offset.
    //
    // Parameters:
    //   from (string, required): Origin: place name, IATA code or Kiwi id (e.g.
    //     'london', 'LHR', 'City:london_gb')
    //   to (string, required): Destination: place name, IATA code or Kiwi id
    //   date (string): Outbound departure date, YYYY-MM-DD. Defaults to ~30 days out
    //   return_date (string): Optional inbound date, YYYY-MM-DD. Set it for a round
    //     trip; omit for one-way
    //   adults (integer): Adult passengers (1-9)
    //   children (integer): Child passengers (0-9)
    //   infants (integer): Infant passengers (0-9)
    //   cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    //   sort (string): Result ordering. One of: QUALITY, PRICE, DURATION
    //   currency (string): Price currency (ISO code)
    //   limit (integer): Max itineraries per page
    //   offset (integer): Pagination offset
    public Task<JsonElement> SearchAsync(IDictionary<string, object?> parameters, CancellationToken cancellationToken = default) =>
        GetAsync("/search", parameters, cancellationToken, "from", "to");

    // Flight search with departure and return date windows, a price range and a stop
    // limit. from/to take codes, names of any place type, countries, regions, continents,
    // or to=anywhere; unclear values answer 400 with candidates. At most 50 itineraries
    // per search: narrow it to reach others.
    //
    // Parameters:
    //   from (string, required): Origin. Codes first: a 3-letter code is an airport
    //     (else a metro city code such as LON), an upper-case 2-letter code a country
    //     (else a continent such as EU). Then a name of any place type (city, airport,
    //     subdivision, country, region, continent), case and accent insensitive, or a
    //     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
    //     unknown value answers 400 with candidates
    //   to (string, required): Destination, same rules as from, plus 'anywhere' for
    //     every destination
    //   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
    //     30 days from today
    //   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
    //     Defaults to date_from (a single day)
    //   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
    //     round trip; omit for one-way
    //   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
    //     Defaults to return_from
    //   min_price (number): Lowest total price, in `currency`
    //   max_price (number): Highest total price, in `currency`
    //   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
    //     0, 1, 2, 3
    //   adults (integer): Adult passengers (1-9)
    //   children (integer): Child passengers (0-8)
    //   infants (integer): Infant passengers (at most one per adult)
    //   cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    //   sort (string): Which 50 itineraries the search keeps, and their order. One of:
    //     QUALITY, PRICE, DURATION
    //   currency (string): Price currency (3-letter ISO code); min_price and max_price
    //     use it too
    //   limit (integer): Itineraries per page. A search returns at most 50 itineraries
    //     (see data.cap)
    //   offset (integer): Offset within the at most 50 itineraries of this search. Rows
    //     past 50 are not reachable by offset: narrow the dates, price or stops instead
    public Task<JsonElement> SearchV2Async(IDictionary<string, object?> parameters, CancellationToken cancellationToken = default) =>
        GetAsync("/search-v2", parameters, cancellationToken, "from", "to");

    private static string First(params string?[] values) => values.First(value => !string.IsNullOrEmpty(value))!;

    private async Task<JsonElement> GetAsync(string path, IDictionary<string, object?> parameters, CancellationToken cancellationToken, params string[] required)
    {
        foreach (var name in required)
        {
            if (!parameters.TryGetValue(name, out var given) || given is null)
            {
                throw new ArgumentException($"Missing required parameter: {name}");
            }
        }
        var query = new List<string>();
        foreach (var (name, value) in parameters)
        {
            if (value is null)
            {
                continue;
            }
            var text = value switch
            {
                bool flag => flag ? "true" : "false",
                IFormattable number => number.ToString(null, CultureInfo.InvariantCulture),
                _ => value.ToString() ?? "",
            };
            var token = "{" + name + "}";
            if (path.Contains(token))
            {
                path = path.Replace(token, Uri.EscapeDataString(text));
            }
            else
            {
                query.Add(Uri.EscapeDataString(name) + "=" + Uri.EscapeDataString(text));
            }
        }
        var url = _baseUrl + path + (query.Count > 0 ? "?" + string.Join("&", query) : "");
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        request.Headers.Accept.ParseAdd("application/json");
        request.Headers.UserAgent.ParseAdd("kiwi-unofficial-sdk/0.1.0 (csharp)");
        using var response = await _http.SendAsync(request, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        JsonElement? data = null;
        try
        {
            using var document = JsonDocument.Parse(body);
            data = document.RootElement.Clone();
        }
        catch (JsonException)
        {
        }
        if (response.IsSuccessStatusCode && data is JsonElement result)
        {
            return result;
        }
        string Field(string name, string fallback) =>
            data is { ValueKind: JsonValueKind.Object } detail && detail.TryGetProperty(name, out var field) && field.ValueKind == JsonValueKind.String
                ? field.GetString()!
                : fallback;
        throw new ApiError((int)response.StatusCode, Field("error", "http_error"), Field("message", body.Length > 200 ? body[..200] : body));
    }
}
