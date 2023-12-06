from espn_api.basketball import League
from espn_api.requests.espn_requests import ESPNAccessDenied
from typing import Callable, Dict
from data import ClientErrorCodes, ClientError
from datetime import datetime
import os


class LeagueApi:
    def __init__(self, league_auth: dict, year: int = None):
        self._errors = list()
        league_year = year or self.get_default_league_year()
        try:
            self.league = League(**league_auth, year=league_year,
                                 league_id=int(os.environ["LEAGUE_ID"]))
        except ESPNAccessDenied:
            self.league = None
            self._errors.append(ClientError(
                ClientErrorCodes.LEAGUE_API_AUTH, "ESPN api private league authentication credentials are not valid"))

    def make_request(self, callback: Callable[[League], Dict]):
        if not len(self._errors):
            try:
                return callback(self.league)
            except Exception as err:
                print("ERR: LEAGUE_API: ", err)
                self._errors.append(ClientError(
                    ClientErrorCodes.LEAGUE_API, "General ESPN api request error"))

        return self.client_errors

    def get_default_league_year(self):
        today = datetime.now()
        current_month = today.month
        current_year = today.year
        if (current_month >= 10):
            return current_year + 1
        return current_year

    @property
    def client_errors(self):
        return {"client_errors": self._errors}

    @client_errors.setter
    def set_error(self, error: ClientError):
        self._errors.append(error)
