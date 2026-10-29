from ariadne import QueryType
from data import ClientBoxScore
from resources.edge import EdgeStore
from resources.league_api import LeagueApi
from resources.scoring import build_leaderboard
from resolvers.response import ClientError, ClientErrorCodes, Response


query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(*_, year=None, matchup_period_offset=None):
    league_config = EdgeStore().get_league(1)
    if league_config is None:
        response = Response()
        response.add_error(ClientError(
            ClientErrorCodes.LEAGUE_API, "no leagues configured"))
        return response.resolve()

    league, response = LeagueApi(league_config.id, year).init()
    if league is None:
        return response.resolve()

    try:
        matchup_period = league.currentMatchupPeriod + \
            (matchup_period_offset or 0)
        box_scores = league.box_scores(matchup_period=matchup_period)
        response_data = {"box_scores": map(
            lambda box_score: ClientBoxScore(box_score), box_scores), "current_matchup_period": league.currentMatchupPeriod}
        return response.resolve(response_data)
    except Exception as err:
        response.add_error(
            ClientError(ClientErrorCodes.LEAGUE_API, str(err)))

    return response.resolve()


@query.field("getLeagues")
def resolve_get_leagues(*_):
    response = Response()
    try:
        leagues = EdgeStore().leagues
        data = {"leagues": [{"index": i + 1, "name": league.name}
                            for i, league in enumerate(leagues)]}
        return response.resolve(data)
    except Exception as err:
        response.add_error(ClientError(ClientErrorCodes.EDGE_API, str(err)))

    return response.resolve()


@query.field("getLeaderboard")
def resolve_get_leaderboard(*_, league_index, year=None, matchup_period_offset=None):
    league_config = EdgeStore().get_league(league_index)
    if league_config is None:
        response = Response()
        response.add_error(ClientError(
            ClientErrorCodes.LEAGUE_API, f"no league configured at index {league_index}"))
        return response.resolve()

    league, response = LeagueApi(league_config.id, year).init()
    if league is None:
        return response.resolve()

    try:
        current_matchup_period = league.currentMatchupPeriod
        matchup_period = current_matchup_period + (matchup_period_offset or 0)
        box_scores = league.box_scores(matchup_period=matchup_period)
        leaderboard = build_leaderboard(
            box_scores,
            league_index=league_index,
            league_name=league_config.name,
            current_matchup_period=current_matchup_period,
            matchup_period=matchup_period,
        )
        return response.resolve({"leaderboard": leaderboard})
    except Exception as err:
        response.add_error(
            ClientError(ClientErrorCodes.LEAGUE_API, str(err)))

    return response.resolve()
