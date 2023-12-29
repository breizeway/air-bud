from espn_api.basketball import League
from espn_api.requests.espn_requests import ESPNAccessDenied
from resolvers.response import ClientErrorCodes, ClientError, Response
from datetime import datetime
from resources.edge import EdgeStore
import os


class LeagueApi:
    def __init__(self, year: int = None):
        self.league: League = None
        # self.current_matchup_period = None
        self.response: Response = Response()
        league_year = year or self.get_default_league_year()

        try:
            league_auth = EdgeStore().league_auth
            self.league = League(league_id=int(
                os.environ["LEAGUE_ID"]), year=league_year, swid=league_auth.swid, espn_s2=league_auth.espn_s2)
        except ESPNAccessDenied:
            self.response.add_error(ClientError(
                ClientErrorCodes.LEAGUE_API_AUTH, "ESPN api private league authentication credentials are not valid"))

    def init(self):
        return [self.league, self.response]

    def get_default_league_year(self):
        today = datetime.now()
        current_month = today.month
        current_year = today.year

        if (current_month >= 10):
            return current_year + 1
        return current_year
