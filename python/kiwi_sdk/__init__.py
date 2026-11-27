"""Unofficial Kiwi.com API client for Python.

Search and compare flights on Kiwi.com — itineraries with live prices, airlines, routes and departure/arrival times, plus location and route discovery.

Not affiliated with Kiwi.com. Endpoint reference: https://maviapi.com/apis/kiwi
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, Optional

__version__ = "0.1.0"
__all__ = ["KiwiClient", "ApiError", "DEMO_KEY"]

DEMO_KEY = "mvk_test_playground_5f3c1a8d"


class ApiError(Exception):
    """An error status answered by the API."""

    def __init__(self, status: int, code: str, message: str) -> None:
        super().__init__(f"{status} {code}: {message}")
        self.status = status
        self.code = code
        self.message = message


class KiwiClient:
    """Kiwi.com API client.

    With no api_key it uses the MAVIAPI_API_KEY environment variable, then the
    shared demo key.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        *,
        base_url: Optional[str] = None,
        timeout: float = 120.0,
    ) -> None:
        self.api_key = api_key or os.environ.get("MAVIAPI_API_KEY") or DEMO_KEY
        root = base_url or os.environ.get("MAVIAPI_BASE_URL") or "https://api.maviapi.com"
        self.base_url = root.rstrip("/") + "/v1/sites/kiwi"
        self.timeout = timeout

    def airports_near(self, *, lat: float, lon: float, radius_km: Optional[float] = None, include_inactive: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Airports within a radius of a lat/lon point, nearest first, with distance, city,
        country and a popularity hint.

        Parameters:
          lat (number, required): Latitude of the point, in decimal degrees
          lon (number, required): Longitude of the point, in decimal degrees
          radius_km (number): Search radius in km (default 150, max 500)
          include_inactive (string): true also returns airports Kiwi sells no flights from
            (small airfields, military fields). One of: false, true
          limit (integer): Airports per page. The source returns at most the 50 nearest
            airports per call (data.capped); narrow radius_km to stay under it
          offset (integer): Offset within the at most 50 nearest airports of a call
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/airports-near", {"lat": lat, "lon": lon, "radius_km": radius_km, "include_inactive": include_inactive, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def explore(self, *, from_: str, to: Optional[str] = None, date_from: Optional[str] = None, date_to: Optional[str] = None, return_from: Optional[str] = None, return_to: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, max_stops: Optional[int] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, sort: Optional[str] = None, currency: Optional[str] = None, expand: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Cheapest flight to every destination city from a place, like the site's 'anywhere'
        search: one row per city with price, airport and times. Narrow by country, region or
        continent, dates, price and stops; expand attaches full itineraries.

        Parameters:
          from_ (string, required): Origin. Codes first: a 3-letter code is an airport
            (else a metro city code such as LON), an upper-case 2-letter code a country
            (else a continent such as EU). Then a name of any place type (city, airport,
            subdivision, country, region, continent), case and accent insensitive, or a
            search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
            unknown value answers 400 with candidates
          to (string): Optional broad scope for the destinations: a country, subdivision,
            region or continent (code, name or search id, same rules as from). Omit or
            'anywhere' for every destination
          date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
            30 days from today
          date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
            Defaults to date_from (a single day)
          return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
            round trip; omit for one-way
          return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
            Defaults to return_from
          min_price (number): Lowest price per destination, in `currency`
          max_price (number): Highest price per destination, in `currency`
          max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
            0, 1, 2, 3
          adults (integer): Adult passengers (1-9)
          children (integer): Child passengers (0-8)
          infants (integer): Infant passengers (at most one per adult)
          sort (string): Which flight represents each city and the order of the cities:
            PRICE = cheapest first, POPULARITY = the site's popular destinations first (the
            set differs a little per sort). One of: PRICE, POPULARITY, QUALITY, DURATION,
            DATE
          currency (string): Price currency (3-letter ISO code); min_price and max_price
            use it too
          expand (integer): Also attach the top 3 itineraries (segments, airlines, booking
            link) for the destinations ranked 1 to N (on whichever page they fall). 0 =
            none. One of: 0, 1, 2, 3, 4, 5
          limit (integer): Destinations per page (max 1000). Every reachable city is
            returned, see pagination.total
          offset (integer): Pagination offset over every destination city
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/explore", {"from": from_, "to": to, "date_from": date_from, "date_to": date_to, "return_from": return_from, "return_to": return_to, "min_price": min_price, "max_price": max_price, "max_stops": max_stops, "adults": adults, "children": children, "infants": infants, "sort": sort, "currency": currency, "expand": expand, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def explore_v2(self, *, from_: str, to: Optional[str] = None, date_from: Optional[str] = None, date_to: Optional[str] = None, return_from: Optional[str] = None, return_to: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, max_stops: Optional[int] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, sort: Optional[str] = None, currency: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Cheapest flight to every destination city from a place, like the site's 'anywhere'
        search, with that flight's airlines, stops, duration, local departure and arrival
        times and booking link on every row. Same filters and destination fields as
        /explore; paged by cursor.

        Parameters:
          from_ (string, required): Origin. Codes first: a 3-letter code is an airport
            (else a metro city code such as LON), an upper-case 2-letter code a country
            (else a continent such as EU). Then a name of any place type (city, airport,
            subdivision, country, region, continent), case and accent insensitive, or a
            search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
            unknown value answers 400 with candidates
          to (string): Optional broad scope for the destinations: a country, subdivision,
            region or continent (code, name or search id, same rules as from). Omit or
            'anywhere' for every destination
          date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
            30 days from today
          date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
            Defaults to date_from (a single day)
          return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
            round trip; omit for one-way
          return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
            Defaults to return_from
          min_price (number): Lowest price per destination, in `currency`
          max_price (number): Highest price per destination, in `currency`
          max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
            0, 1, 2, 3
          adults (integer): Adult passengers (1-9)
          children (integer): Child passengers (0-8)
          infants (integer): Infant passengers (at most one per adult)
          sort (string): Order of the cities (and which flight sets the destination
            price): PRICE = cheapest first, POPULARITY = the site's popular destinations
            first. The flight on each row is always that city's cheapest itinerary. One of:
            PRICE, POPULARITY, QUALITY, DURATION, DATE
          currency (string): Price currency (3-letter ISO code); min_price and max_price
            use it too
          limit (integer): Destinations per page (max 200). Every reachable city is
            returned, see pagination.total; walk the rest with cursor
          offset (integer): Pagination offset over every destination city
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/explore-v2", {"from": from_, "to": to, "date_from": date_from, "date_to": date_to, "return_from": return_from, "return_to": return_to, "min_price": min_price, "max_price": max_price, "max_stops": max_stops, "adults": adults, "children": children, "infants": infants, "sort": sort, "currency": currency, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def places(self, *, q: Optional[str] = None, type: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA
        code. Params: q, type, limit/offset.

        Parameters:
          q (string): Search term (place name or IATA code)
          type (string): Location type to search. One of: city, airport, country, region,
            subdivision
          limit (integer): Max places per page
          offset (integer): Pagination offset
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/places", {"q": q, "type": type, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def places_v2(self, *, q: str, type: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Search Kiwi locations of every type by name or code, with an optional type filter.
        Every row carries its country (airports included) and a search_id for /search-v2.

        Parameters:
          q (string, required): Place name or code (case and accent insensitive)
          type (string): Optional filter: one type or a comma list of city, airport,
            country, subdivision, region, continent, autonomous_territory, special,
            tourist_region. Omit to search every type. One of: city, airport, country,
            subdivision, region, continent, autonomous_territory, special, tourist_region
          limit (integer): Places per page (max 1000)
          offset (integer): Pagination offset within the at most 1000 places of a query
            (see data.cap)
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/places-v2", {"q": q, "type": type, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def places_by_id(self, *, id: str, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        One Kiwi location by id or code: name, type, codes, city, country, region,
        continent, time zone, population and coordinates.

        Parameters:
          id (string, required): A Kiwi location id: an airport code (CRL), a city id
            (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe),
            or a search id from /places-v2 or /explore (Airport:CRL, City:london_gb)
          undefined (string)
        """
        return self._get("/places/{id}", {"id": id, undefined: undefined})

    def revalidate(self, *, id: str, currency: Optional[str] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Check one itinerary from /search-v2 or /search-v3 again before booking: whether it
        is still available, its current price for the given passengers and currency, a fresh
        booking link, fetched_at and expires_at. Never cached.

        Parameters:
          id (string, required): The itinerary id (`id`) of a row from /search-v2 or
            /search-v3, one-way or return
          currency (string): Price currency (3-letter ISO code). Pass the currency of the
            search the id came from to compare with quoted_price
          adults (integer): Adult passengers (1-9)
          children (integer): Child passengers (0-8)
          infants (integer): Infant passengers, at most one per adult
          undefined (string)
        """
        return self._get("/revalidate", {"id": id, "currency": currency, "adults": adults, "children": children, "infants": infants, undefined: undefined})

    def routes(self, *, page: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        List published city-pair routes from Kiwi route sitemaps. Params: page,
        limit/offset.

        Parameters:
          page (integer): Which route sub-sitemap to read (0-based). Kiwi splits ~50k
            routes per file across many files
          limit (integer): Max routes per page
          offset (integer): Pagination offset within the sub-sitemap
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/routes", {"page": page, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def search(self, *, from_: str, to: str, date: Optional[str] = None, return_date: Optional[str] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, cabin: Optional[str] = None, sort: Optional[str] = None, currency: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Flight search: itineraries with prices, airlines, routes and departure/arrival
        times. from/to accept place names, IATA codes or Kiwi ids; date/return_date,
        adults/children/infants, cabin, sort, currency, limit/offset.

        Parameters:
          from_ (string, required): Origin: place name, IATA code or Kiwi id (e.g.
            'london', 'LHR', 'City:london_gb')
          to (string, required): Destination: place name, IATA code or Kiwi id
          date (string): Outbound departure date, YYYY-MM-DD. Defaults to ~30 days out
          return_date (string): Optional inbound date, YYYY-MM-DD. Set it for a round
            trip; omit for one-way
          adults (integer): Adult passengers (1-9)
          children (integer): Child passengers (0-9)
          infants (integer): Infant passengers (0-9)
          cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
          sort (string): Result ordering. One of: QUALITY, PRICE, DURATION
          currency (string): Price currency (ISO code)
          limit (integer): Max itineraries per page
          offset (integer): Pagination offset
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/search", {"from": from_, "to": to, "date": date, "return_date": return_date, "adults": adults, "children": children, "infants": infants, "cabin": cabin, "sort": sort, "currency": currency, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def search_v2(self, *, from_: str, to: str, date_from: Optional[str] = None, date_to: Optional[str] = None, return_from: Optional[str] = None, return_to: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, max_stops: Optional[int] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, cabin: Optional[str] = None, sort: Optional[str] = None, currency: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Flight search with departure and return date windows, a price range and a stop
        limit. from/to take codes, names of any place type, countries, regions, continents,
        or to=anywhere; unclear values answer 400 with candidates. At most 50 itineraries
        per search: narrow it to reach others.

        Parameters:
          from_ (string, required): Origin. Codes first: a 3-letter code is an airport
            (else a metro city code such as LON), an upper-case 2-letter code a country
            (else a continent such as EU). Then a name of any place type (city, airport,
            subdivision, country, region, continent), case and accent insensitive, or a
            search id from /places-v2 (e.g. 'Airport:CRL', 'Country:TR'). An unclear or
            unknown value answers 400 with candidates
          to (string, required): Destination, same rules as from, plus 'anywhere' for
            every destination
          date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
            30 days from today
          date_to (string): End of the departure date window, YYYY-MM-DD (inclusive).
            Defaults to date_from (a single day)
          return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
            round trip; omit for one-way
          return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
            Defaults to return_from
          min_price (number): Lowest total price, in `currency`
          max_price (number): Highest total price, in `currency`
          max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
            0, 1, 2, 3
          adults (integer): Adult passengers (1-9)
          children (integer): Child passengers (0-8)
          infants (integer): Infant passengers (at most one per adult)
          cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
          sort (string): Which 50 itineraries the search keeps, and their order. One of:
            QUALITY, PRICE, DURATION
          currency (string): Price currency (3-letter ISO code); min_price and max_price
            use it too
          limit (integer): Itineraries per page. A search returns at most 50 itineraries
            (see data.cap)
          offset (integer): Offset within the at most 50 itineraries of this search. Rows
            past 50 are not reachable by offset: narrow the dates, price or stops instead
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/search-v2", {"from": from_, "to": to, "date_from": date_from, "date_to": date_to, "return_from": return_from, "return_to": return_to, "min_price": min_price, "max_price": max_price, "max_stops": max_stops, "adults": adults, "children": children, "infants": infants, "cabin": cabin, "sort": sort, "currency": currency, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def search_v3(self, *, from_: str, to: str, date_from: Optional[str] = None, date_to: Optional[str] = None, return_from: Optional[str] = None, return_to: Optional[str] = None, departure_from: Optional[str] = None, departure_to: Optional[str] = None, arrival_from: Optional[str] = None, arrival_to: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, max_stops: Optional[int] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, cabin: Optional[str] = None, sort: Optional[str] = None, currency: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None, undefined: Optional[str] = None, undefined: Optional[str] = None, undefined: Optional[str] = None) -> Dict[str, Any]:
        """
        Flight search with date windows plus several origins and destinations
        (from=BRU,CRL), local departure and arrival time windows, and every itinerary the
        search has, paged by cursor, with total_estimate. Each itinerary names the origin
        and destination it matched and when its price expires.

        Parameters:
          from_ (string, required): Origin: one place or a comma list of up to 3 (BRU,CRL
            or LON,STN). Each item follows the /search-v2 rules: a 3-letter code is an
            airport (else a metro city code such as LON), an upper-case 2-letter code a
            country (else a continent), then a name of any place type, case and accent
            insensitive, or a search id from /places-v2 ('Airport:CRL'). Names that contain
            a comma need their search id. An unclear item answers 400 with candidates
          to (string, required): Destination: one place or a comma list of up to 3, same
            rules as from, or 'anywhere' alone for every destination
          date_from (string): Start of the departure date window, YYYY-MM-DD. Defaults to
            30 days from today
          date_to (string): End of the departure date window, YYYY-MM-DD (inclusive, at
            most 92 days after date_from). Defaults to date_from (a single day)
          return_from (string): Start of the return date window, YYYY-MM-DD. Set it for a
            round trip; omit for one-way
          return_to (string): End of the return date window, YYYY-MM-DD (inclusive).
            Defaults to return_from
          departure_from (string): Earliest local departure time of the outbound leg,
            HH:MM (00:00 to 23:59), at the first departure airport. A window cannot cross
            midnight
          departure_to (string): Latest local departure time of the outbound leg, HH:MM
            (inclusive, 00:00 to 24:00), at the first departure airport. A window cannot
            cross midnight
          arrival_from (string): Earliest local arrival time of the outbound leg, HH:MM
            (00:00 to 23:59), at the final arrival airport. A window cannot cross midnight
          arrival_to (string): Latest local arrival time of the outbound leg, HH:MM
            (inclusive, 00:00 to 24:00), at the final arrival airport. A window cannot cross
            midnight
          min_price (number): Lowest total price, in `currency`
          max_price (number): Highest total price, in `currency`
          max_stops (integer): Most stops per leg (0 = direct only). Omit for any. One of:
            0, 1, 2, 3
          adults (integer): Adult passengers (1-9)
          children (integer): Child passengers (0-8)
          infants (integer): Infant passengers (at most one per adult)
          cabin (string): Cabin class. One of: ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
          sort (string): Order of the itineraries. PRICE and DURATION sort all of them;
            QUALITY keeps the site's own ranking inside each part of the search (the best of
            each first), then price. One of: QUALITY, PRICE, DURATION
          currency (string): Price currency (3-letter ISO code); min_price and max_price
            use it too
          limit (integer): Itineraries per page. Every itinerary of the search is
            reachable: follow pagination.next_cursor (or offset) while pagination.has_more
            is true
          offset (integer): Offset into all the itineraries of the search
          undefined (string)
          undefined (string)
          undefined (string)
        """
        return self._get("/search-v3", {"from": from_, "to": to, "date_from": date_from, "date_to": date_to, "return_from": return_from, "return_to": return_to, "departure_from": departure_from, "departure_to": departure_to, "arrival_from": arrival_from, "arrival_to": arrival_to, "min_price": min_price, "max_price": max_price, "max_stops": max_stops, "adults": adults, "children": children, "infants": infants, "cabin": cabin, "sort": sort, "currency": currency, "limit": limit, "offset": offset, undefined: undefined, undefined: undefined, undefined: undefined})

    def _get(self, path: str, params: Dict[str, Any]) -> Dict[str, Any]:
        query = {}
        for name, value in params.items():
            if value is None:
                continue
            text = str(value).lower() if isinstance(value, bool) else str(value)
            token = "{" + name + "}"
            if token in path:
                path = path.replace(token, urllib.parse.quote(text, safe=""))
            else:
                query[name] = text
        url = self.base_url + path + ("?" + urllib.parse.urlencode(query) if query else "")
        request = urllib.request.Request(
            url,
            headers={
                "Authorization": "Bearer " + self.api_key,
                "Accept": "application/json",
                "User-Agent": "kiwi-unofficial-sdk/0.1.0 (python)",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                return json.loads(response.read())
        except urllib.error.HTTPError as error:
            body = error.read().decode("utf-8", "replace")
            try:
                detail = json.loads(body)
            except ValueError:
                detail = None
            if not isinstance(detail, dict):
                detail = {}
            raise ApiError(
                error.code,
                str(detail.get("error", "http_error")),
                str(detail.get("message", body[:200])),
            ) from None
