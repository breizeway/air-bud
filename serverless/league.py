from espn_api.basketball import League
import os


def init_league(league_config: dict):
    league_config.update({"year": league_config.get("year", 2024)})
    league_config.update({"league_id": int(os.environ["LEAGUE_ID"])})
    return League(**league_config)
