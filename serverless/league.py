from espn_api.basketball import League
from espn_api.requests.espn_requests import ESPNAccessDenied
from typing import Callable, Dict, Optional, cast
import os


class ClientError:
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message


def init_league(league_config: dict):
    league_config.update({"year": league_config.get("year", 2024)})
    league_config.update({"league_id": int(os.environ["LEAGUE_ID"])})
    return League(**league_config)


def make_league_request(league_config, callback):
    try:
        return callback(init_league(league_config))
    except ESPNAccessDenied as err:
        print(":::ERR::: ", err)
        return {"client_errors": [ClientError("LEAGUE_AUTH", "League credentials not valid")]}
