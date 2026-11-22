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

    def explore(self, *, from_: str, to: Optional[str] = None, date_from: Optional[str] = None, date_to: Optional[str] = None, return_from: Optional[str] = None, return_to: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, max_stops: Optional[int] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, sort: Optional[str] = None, currency: Optional[str] = None, expand: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
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
        """
        return self._get("/explore", {"from": from_, "to": to, "date_from": date_from, "date_to": date_to, "return_from": return_from, "return_to": return_to, "min_price": min_price, "max_price": max_price, "max_stops": max_stops, "adults": adults, "children": children, "infants": infants, "sort": sort, "currency": currency, "expand": expand, "limit": limit, "offset": offset})

    def places(self, *, q: Optional[str] = None, type: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
        """
        Search Kiwi locations (city/airport/country/region/subdivision) by name or IATA
        code. Params: q, type, limit/offset.

        Parameters:
          q (string): Search term (place name or IATA code)
          type (string): Location type to search. One of: city, airport, country, region,
            subdivision
          limit (integer): Max places per page
          offset (integer): Pagination offset
        """
        return self._get("/places", {"q": q, "type": type, "limit": limit, "offset": offset})

    def places_v2(self, *, q: str, type: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
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
        """
        return self._get("/places-v2", {"q": q, "type": type, "limit": limit, "offset": offset})

    def places_id(self, *, id: str) -> Dict[str, Any]:
        """
        One Kiwi location by id or code: name, type, codes, city, country, region,
        continent, time zone, population and coordinates.

        Parameters:
          id (string, required): A Kiwi location id: an airport code (CRL), a city id
            (london_gb), a country code (GB), a subdivision (FL_US), a continent (europe),
            or a search id from /places-v2 or /explore (Airport:CRL, City:london_gb)
        """
        return self._get("/places/{id}", {"id": id})

    def routes(self, *, page: Optional[int] = None, limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
        """
        List published city-pair routes from Kiwi route sitemaps. Params: page,
        limit/offset.

        Parameters:
          page (integer): Which route sub-sitemap to read (0-based). Kiwi splits ~50k
            routes per file across many files
          limit (integer): Max routes per page
          offset (integer): Pagination offset within the sub-sitemap
        """
        return self._get("/routes", {"page": page, "limit": limit, "offset": offset})

    def search(self, *, from_: str, to: str, date: Optional[str] = None, return_date: Optional[str] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, cabin: Optional[str] = None, sort: Optional[str] = None, currency: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
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
        """
        return self._get("/search", {"from": from_, "to": to, "date": date, "return_date": return_date, "adults": adults, "children": children, "infants": infants, "cabin": cabin, "sort": sort, "currency": currency, "limit": limit, "offset": offset})

    def search_v2(self, *, from_: str, to: str, date_from: Optional[str] = None, date_to: Optional[str] = None, return_from: Optional[str] = None, return_to: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, max_stops: Optional[int] = None, adults: Optional[int] = None, children: Optional[int] = None, infants: Optional[int] = None, cabin: Optional[str] = None, sort: Optional[str] = None, currency: Optional[str] = None, limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
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
        """
        return self._get("/search-v2", {"from": from_, "to": to, "date_from": date_from, "date_to": date_to, "return_from": return_from, "return_to": return_to, "min_price": min_price, "max_price": max_price, "max_stops": max_stops, "adults": adults, "children": children, "infants": infants, "cabin": cabin, "sort": sort, "currency": currency, "limit": limit, "offset": offset})

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
