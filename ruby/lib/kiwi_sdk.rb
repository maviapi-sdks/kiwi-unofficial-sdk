# frozen_string_literal: true

# Unofficial Kiwi.com API client for Ruby.
# Not affiliated with Kiwi.com. Endpoint reference: https://maviapi.com/apis/kiwi

require "json"
require "net/http"
require "uri"

module KiwiSdk
  VERSION = "0.1.0"
  DEMO_KEY = "mvk_test_playground_5f3c1a8d"

  # An error status answered by the API.
  class ApiError < StandardError
    attr_reader :status, :code

    def initialize(status, code, message)
      super("#{status} #{code}: #{message}")
      @status = status
      @code = code
    end
  end

  class Client
    # With no api_key it uses the MAVIAPI_API_KEY environment variable, then the
    # shared demo key.
    def initialize(api_key: nil, base_url: nil, timeout: 120)
      given = ->(*values) { values.find { |value| value && !value.empty? } }
      @api_key = given.call(api_key, ENV["MAVIAPI_API_KEY"], DEMO_KEY)
      root = given.call(base_url, ENV["MAVIAPI_BASE_URL"], "https://api.maviapi.com")
      @base_url = root.sub(%r{/+\z}, "") + "/v1/sites/kiwi"
      @timeout = timeout
    end

    # Cheapest flight to every destination city from a place, like the site's 'anywhere'
    # search: one row per city with price, airport and times. Narrow by country, region or
    # continent, dates, price and stops; expand attaches full itineraries.
    #
    # Parameters:
    #   from (string, required): Origin. Codes first: a 3-letter code is an airport
    #     (else a metro city code such as LON), an upper-case 2-letter code a country
    #     (else a continent such as EU). Then a name of any place type (city, airport,
    #     subdivision, country, region, continent), case and accent insensitive, or a
    #     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
    #     unknown value answers 400 with candidates
    #   to (string): Optional broad scope for the destinations: a country, subdivision,
    #     region or continent (code, name or search id, same rules as from). Omit or
    #     'anywhere' for every destination
    #   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
    #     30 days from today
    #   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
    #     Defaults to date_from (a single day)
    #   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
    #     round trip; omit for one-way
    #   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
    #     Defaults to return_from
    #   min_price (number): Lowest price per destination, in `currency`
    #   max_price (number): Highest price per destination, in `currency`
    #   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
    #     0, 1, 2, 3
    #   adults (integer): Adult passengers (1-9)
    #   children (integer): Child passengers (0-8)
    #   infants (integer): Infant passengers (at most one per adult)
    #   sort (string): Which flight represents each city and the order of the cities:
    #     PRICE = cheapest first, POPULARITY = the site's popular destinations first (the
    #     set differs a little per sort). One of: PRICE, POPULARITY, QUALITY, DURATION,
    #     DATE
    #   currency (string): Price currency (3-letter ISO code); min_price and max_price
    #     use it too
    #   expand (integer): Also attach the top 3 itineraries (segments, airlines, booking
    #     link) for the destinations ranked 1 to N (on whichever page they fall). 0 =
    #     none. One of: 0, 1, 2, 3, 4, 5
    #   limit (integer): Destinations per page (max 1000). Every reachable city is
    #     returned, see pagination.total
    #   offset (integer): Pagination offset over every destination city
    #   undefined (string)
    #   undefined (string)
    #   undefined (string)
    def explore(**params)
      get("/explore", params, %w[from])
    end

    # Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA
    # code. Params: q, type, limit/offset.
    #
    # Parameters:
    #   q (string): Search term (place name or IATA code)
    #   type (string): Location type to search. One of: city, airport, country, region,
    #     subdivision
    #   limit (integer): Max places per page
    #   offset (integer): Pagination offset
    #   undefined (string)
    #   undefined (string)
    #   undefined (string)
    def places(**params)
      get("/places", params, %w[])
    end

    # Search Kiwi locations of every type by name or code, with an optional type filter.
    # Every row carries its country (airports included) and a search_id for /search-v2.
    #
    # Parameters:
    #   q (string, required): Place name or code (case and accent insensitive)
    #   type (string): Optional filter: one type or a comma list of city, airport,
    #     country, subdivision, region, continent, autonomous_territory, special,
    #     tourist_region. Omit to search every type. One of: city, airport, country,
    #     subdivision, region, continent, autonomous_territory, special, tourist_region
    #   limit (integer): Places per page (max 1000)
    #   offset (integer): Pagination offset within the at most 1000 places of a query
    #     (see data.cap)
    #   undefined (string)
    #   undefined (string)
    #   undefined (string)
    def places_v2(**params)
      get("/places-v2", params, %w[q])
    end

    # One Kiwi location by id or code: name, type, codes, city, country, region,
    # continent, time zone, population and coordinates.
    #
    # Parameters:
    #   id (string, required): A Kiwi location id: an airport code (CRL), a city id
    #     (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe),
    #     or a search id from /places-v2 or /explore (Airport:CRL, City:london_gb)
    #   undefined (string)
    def places_by_id(**params)
      get("/places/{id}", params, %w[id])
    end

    # Check one itinerary from /search-v2 or /search-v3 again before booking: whether it
    # is still available, its current price for the given passengers and currency, a fresh
    # booking link, fetched_at and expires_at. Never cached.
    #
    # Parameters:
    #   id (string, required): The itinerary id (`id`) of a row from /search-v2 or
    #     /search-v3, one-way or return
    #   currency (string): Price currency (3-letter ISO code). Pass the currency of the
    #     search the id came from to compare with quoted_price
    #   adults (integer): Adult passengers (1-9)
    #   children (integer): Child passengers (0-8)
    #   infants (integer): Infant passengers, at most one per adult
    #   undefined (string)
    def revalidate(**params)
      get("/revalidate", params, %w[id])
    end

    # List published city-pair routes from Kiwi route sitemaps. Params: page,
    # limit/offset.
    #
    # Parameters:
    #   page (integer): Which route sub-sitemap to read (0-based). Kiwi splits ~50k
    #     routes per file across many files
    #   limit (integer): Max routes per page
    #   offset (integer): Pagination offset within the sub-sitemap
    #   undefined (string)
    #   undefined (string)
    #   undefined (string)
    def routes(**params)
      get("/routes", params, %w[])
    end

    # Flight search: itineraries with prices, airlines, routes and departure/arrival
    # times. from/to accept place names, IATA codes or Kiwi ids; date/return_date,
    # adults/children/infants, cabin, sort, currency, limit/offset.
    #
    # Parameters:
    #   from (string, required): Origin: place name, IATA code or Kiwi id (e.g.
    #     'london', 'LHR', 'City:london_gb')
    #   to (string, required): Destination: place name, IATA code or Kiwi id
    #   date (string): Outbound departure date, YYYY-MM-DD. Defaults to ~30 days out
    #   return_date (string): Optional inbound date, YYYY-MM-DD. Set it for a round
    #     trip; omit for one-way
    #   adults (integer): Adult passengers (1-9)
    #   children (integer): Child passengers (0-9)
    #   infants (integer): Infant passengers (0-9)
    #   cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    #   sort (string): Result ordering. One of: QUALITY, PRICE, DURATION
    #   currency (string): Price currency (ISO code)
    #   limit (integer): Max itineraries per page
    #   offset (integer): Pagination offset
    #   undefined (string)
    #   undefined (string)
    #   undefined (string)
    def search(**params)
      get("/search", params, %w[from to])
    end

    # Flight search with departure and return date windows, a price range and a stop
    # limit. from/to take codes, names of any place type, countries, regions, continents,
    # or to=anywhere; unclear values answer 400 with candidates. At most 50 itineraries
    # per search: narrow it to reach others.
    #
    # Parameters:
    #   from (string, required): Origin. Codes first: a 3-letter code is an airport
    #     (else a metro city code such as LON), an upper-case 2-letter code a country
    #     (else a continent such as EU). Then a name of any place type (city, airport,
    #     subdivision, country, region, continent), case and accent insensitive, or a
    #     search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
    #     unknown value answers 400 with candidates
    #   to (string, required): Destination, same rules as from, plus 'anywhere' for
    #     every destination
    #   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
    #     30 days from today
    #   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
    #     Defaults to date_from (a single day)
    #   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
    #     round trip; omit for one-way
    #   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
    #     Defaults to return_from
    #   min_price (number): Lowest total price, in `currency`
    #   max_price (number): Highest total price, in `currency`
    #   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
    #     0, 1, 2, 3
    #   adults (integer): Adult passengers (1-9)
    #   children (integer): Child passengers (0-8)
    #   infants (integer): Infant passengers (at most one per adult)
    #   cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    #   sort (string): Which 50 itineraries the search keeps, and their order. One of:
    #     QUALITY, PRICE, DURATION
    #   currency (string): Price currency (3-letter ISO code); min_price and max_price
    #     use it too
    #   limit (integer): Itineraries per page. A search returns at most 50 itineraries
    #     (see data.cap)
    #   offset (integer): Offset within the at most 50 itineraries of this search. Rows
    #     past 50 are not reachable by offset: narrow the dates, price or stops instead
    #   undefined (string)
    #   undefined (string)
    #   undefined (string)
    def search_v2(**params)
      get("/search-v2", params, %w[from to])
    end

    # Flight search with date windows plus several origins and destinations
    # (from=BRU,CRL), local departure and arrival time windows, and every itinerary the
    # search has, paged by cursor, with total_estimate. Each itinerary names the origin
    # and destination it matched and when its price expires.
    #
    # Parameters:
    #   from (string, required): Origin: one place or a comma list of up to 3 (BRU,CRL
    #     or LON,STN). Each item follows the /search-v2 rules: a 3-letter code is an
    #     airport (else a metro city code such as LON), an upper-case 2-letter code a
    #     country (else a continent), then a name of any place type, case and accent
    #     insensitive, or a search id from /places-v2 ('Airport:CRL'). Names that contain
    #     a comma need their search id. An unclear item answers 400 with candidates
    #   to (string, required): Destination: one place or a comma list of up to 3, same
    #     rules as from, or 'anywhere' alone for every destination
    #   date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
    #     30 days from today
    #   date_to (string): End of the departure date window, YYYY-MM-DD (inclusive, at
    #     most 92 days after date_from). Defaults to date_from (a single day)
    #   return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
    #     round trip; omit for one-way
    #   return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
    #     Defaults to return_from
    #   departure_from (string): Earliest local departure time of the outbound leg,
    #     HH:MM (00:00 to 23:59), at the first departure airport. A window cannot cross
    #     midnight
    #   departure_to (string): Latest local departure time of the outbound leg, HH:MM
    #     (inclusive, 00:00 to 24:00), at the first departure airport. A window cannot
    #     cross midnight
    #   arrival_from (string): Earliest local arrival time of the outbound leg, HH:MM
    #     (00:00 to 23:59), at the final arrival airport. A window cannot cross midnight
    #   arrival_to (string): Latest local arrival time of the outbound leg, HH:MM
    #     (inclusive, 00:00 to 24:00), at the final arrival airport. A window cannot cross
    #     midnight
    #   min_price (number): Lowest total price, in `currency`
    #   max_price (number): Highest total price, in `currency`
    #   max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
    #     0, 1, 2, 3
    #   adults (integer): Adult passengers (1-9)
    #   children (integer): Child passengers (0-8)
    #   infants (integer): Infant passengers (at most one per adult)
    #   cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    #   sort (string): Order of the itineraries. PRICE and DURATION sort all of them;
    #     QUALITY keeps the site's own ranking inside each part of the search (the best of
    #     each first), then price. One of: QUALITY, PRICE, DURATION
    #   currency (string): Price currency (3-letter ISO code); min_price and max_price
    #     use it too
    #   limit (integer): Itineraries per page. Every itinerary of the search is
    #     reachable: follow pagination.next_cursor (or offset) while pagination.has_more
    #     is true
    #   offset (integer): Offset into all the itineraries of the search
    #   undefined (string)
    #   undefined (string)
    #   undefined (string)
    def search_v3(**params)
      get("/search-v3", params, %w[from to])
    end

    private

    def get(path, params, required)
      params = params.transform_keys(&:to_s)
      missing = required.find { |name| params[name].nil? }
      raise ArgumentError, "missing required parameter: #{missing}" if missing

      query = {}
      params.each do |name, value|
        next if value.nil?

        token = "{#{name}}"
        if path.include?(token)
          path = path.sub(token, URI.encode_www_form_component(value.to_s).gsub("+", "%20"))
        else
          query[name] = value.to_s
        end
      end
      uri = URI(@base_url + path)
      uri.query = URI.encode_www_form(query) unless query.empty?
      request = Net::HTTP::Get.new(uri)
      request["Authorization"] = "Bearer #{@api_key}"
      request["Accept"] = "application/json"
      request["User-Agent"] = "kiwi-unofficial-sdk/0.1.0 (ruby)"
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https", read_timeout: @timeout) do |http|
        http.request(request)
      end
      data = begin
        JSON.parse(response.body.to_s)
      rescue JSON::ParserError
        nil
      end
      return data if response.is_a?(Net::HTTPSuccess)

      detail = data.is_a?(Hash) ? data : {}
      raise ApiError.new(response.code.to_i, detail["error"] || "http_error", detail["message"] || response.body.to_s[0, 200])
    end
  end
end
