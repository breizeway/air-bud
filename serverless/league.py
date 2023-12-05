from espn_api.basketball import League
from espn_api.requests.espn_requests import ESPNAccessDenied
from typing import Callable, Dict
from enum import Enum
import os


class ClientErrorCode(Enum):
    LEAGUE_AUTH = "LEAGUE_AUTH"
    LEAGUE_REQUEST = "LEAGUE_REQUEST"


class ClientError:
    def __init__(self, code: ClientErrorCode, message: str):
        self.code = code
        self.message = message


class PrivateLeague:
    def __init__(self, league_config: dict):
        league_config.update({"year": league_config.get("year", 2024)})
        league_config.update({"league_id": int(os.environ["LEAGUE_ID"])})

        self.errors = list()
        try:
            self.league = League(**league_config)
        except ESPNAccessDenied:
            self.league = None
            self.errors.append(ClientError(
                ClientErrorCode.LEAGUE_AUTH.value, "League credentials not valid"))

    def makeRequest(self, callback: Callable[[League], Dict]):
        if not len(self.errors):
            try:
                return callback(self.league)
            except Exception as err:
                print("ERR: LEAGUE_REQUEST: ", err)
                self.errors.append(ClientError(
                    ClientErrorCode.LEAGUE_REQUEST.value, "There was a problem making a request to the ESPN api"))

        return {"client_errors": self.errors}
