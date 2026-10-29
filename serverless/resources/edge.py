from dataclasses import dataclass
import os
import requests
import json


@dataclass
class LeagueAuth:
    swid: str
    espn_s2: str


@dataclass
class League:
    id: int
    name: str


class EdgeStore:
    def __init__(self):
        self._items = None

    def _hydrate(self):
        if self._items is not None:
            return
        try:
            items_result: requests.Response = requests.get(
                os.environ["EDGE_CONFIG"])
            if (items_result.ok):
                self._items = items_result.json().get("items")
        except Exception as err:
            print("get_edge_config_err: ", err)
        if self._items is None:
            self._items = {}

    @property
    def league_auth(self):
        self._hydrate()
        auth = self._items.get("league_auth")
        return LeagueAuth(**auth) if auth else None

    @property
    def leagues(self):
        """Configured leagues. Falls back to a single league from the LEAGUE_ID
        env var when Edge Config has no `leagues` key yet (local dev /
        pre-migration), so the app keeps working before the array is seeded."""
        self._hydrate()
        raw = self._items.get("leagues")
        if raw:
            return [League(id=int(l["id"]), name=l["name"]) for l in raw]
        league_id = os.environ.get("LEAGUE_ID")
        if league_id:
            return [League(id=int(league_id),
                           name=os.environ.get("LEAGUE_NAME", "League 1"))]
        return []

    def get_league(self, index: int):
        """Resolve a 1-based ordinal (the URL /1, /2) to its League config."""
        leagues = self.leagues
        if index < 1 or index > len(leagues):
            return None
        return leagues[index - 1]

    def set_league_auth(self, league_auth: LeagueAuth):
        result: requests.Response = requests.patch(url=f'https://api.vercel.com/v1/edge-config/{os.environ["EDGE_CONFIG_ID"]}/items',
                                                   headers={"Content-Type": "application/json",
                                                            "Authorization": f'Bearer {os.environ["VERCEL_API_TOKEN"]}'},
                                                   data=json.dumps({"items": [{
                                                       "operation": "update",
                                                       "key": "league_auth",
                                                       "value": league_auth.__dict__}]}))
        if (result.ok):
            self._items = None
            self._hydrate()

        return result
