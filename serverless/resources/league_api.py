from espn_api.basketball import League
from espn_api.requests.espn_requests import ESPNAccessDenied
from typing import Callable, Dict
from data import ClientErrorCodes, ClientError
from datetime import datetime
from resources.edge import EdgeStore
import os


class LeagueApi:
    def __init__(self, year: int = None):
        self._errors = list()
        league_year = year or self.get_default_league_year()
        try:
            league_auth = EdgeStore().league_auth
            self.league = League(swid=league_auth.swid, espn_s2=league_auth.espn_s2, year=league_year,
                                 league_id=int(os.environ["LEAGUE_ID"]))
        except ESPNAccessDenied:
            self.league = None
            self._errors.append(ClientError(
                ClientErrorCodes.LEAGUE_API_AUTH, "ESPN api private league authentication credentials are not valid"))

    def make_request(self, callback: Callable[[League], Dict]):
        if not len(self.errors):
            try:
                return self.build_response(callback(self.league))
            except Exception as err:
                print("ERR: LEAGUE_API: ", err)
                self.add_error(ClientError(
                    ClientErrorCodes.LEAGUE_API, "ESPN api request failed"))

        return self.build_response()

    def get_default_league_year(self):
        today = datetime.now()
        current_month = today.month
        current_year = today.year
        if (current_month >= 10):
            return current_year + 1
        return current_year

    def build_response(self, response: dict = {}):
        return {"success": False if len(self.errors) or all(bool(val) for val in list(response.values())) else True, "errors": self.errors, **response}

    @property
    def errors(self):
        return self._errors

    @errors.setter
    def add_error(self, error: ClientError):
        self._errors.append(error)
