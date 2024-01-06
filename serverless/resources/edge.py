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
                # self._league_auth = LeagueAuth(swid="{3872DC0C-8931-4C30-A0FD-F9AD7CA4C739}",
                #                                espn_s2="AECBu%2BsLXo4Ng7xFxoEEYs93FkzcjD%2Fwc6um1g6fX09ZRXHFB%2FlE85C186wpgxzv68g6OqiPZf%2BRuIFzS2tFyhjfLj7FxRkV2cDnugyILjlR%2BkXZg0KX09B3xe2TtmMGu5mUfj0IeHKbWxYl4QYYV%2BLhw63q7l6ZfFqU8Tqh0eRKOnzHzohoelySXywPpnG2YJRCs8A%2FQb%2Bl0AG50oE%2F%2BvUFeslW9%2BLGhDjOpSuG8LoDyHfDnTiQ3%2Br1Lxt7jBZyC9HnupNl5dm7D5jNus0ledkD")
                # broken until late january because i'm a dumbass and wrote to the api too much
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
