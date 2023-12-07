from dataclasses import dataclass
import os
import requests
import json


@dataclass
class LeagueAuth:
    swid: str
    espn_s2: str


class EdgeStore:
    def __init__(self):
        self._league_auth = None

    def _hydrate(self):
        try:
            items_result: requests.Response = requests.get(
                os.environ["EDGE_CONFIG"])
            if (items_result.ok):
                self._league_auth = LeagueAuth(
                    **items_result.json().get("items").get("league_auth"))
        except Exception as err:
            print("get_edge_config_err: ", err)

    @property
    def league_auth(self):
        if (self._league_auth is None):
            self._hydrate()
        return self._league_auth

    def set_league_auth(self, league_auth: LeagueAuth):
        result: requests.Response = requests.patch(url=f'https://api.vercel.com/v1/edge-config/{os.environ["EDGE_CONFIG_ID"]}/items',
                                                   headers={"Content-Type": "application/json",
                                                            "Authorization": f'Bearer {os.environ["VERCEL_API_TOKEN"]}'},
                                                   data=json.dumps({"items": [{
                                                       "operation": "update",
                                                       "key": "league_auth",
                                                       "value": league_auth.__dict__}]}))
        if (result.ok):
            self._hydrate()

        return result
