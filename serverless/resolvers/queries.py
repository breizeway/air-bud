from ariadne import QueryType
from data import ClientBoxScore
from resources.league_api import LeagueApi
from resolvers.response import ClientError, ClientErrorCodes


query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(*_, year=None, matchup_period_offset=0):
    league, response = LeagueApi(year).init()
    matchup_period = matchup_period_offset + \
        (league.current_matchup_period or 0)

    try:
        box_scores = league.box_scores(matchup_period=matchup_period)
        response_data = {"box_scores": map(
            lambda box_score: ClientBoxScore(box_score), box_scores)}
        return response.resolve(response_data)
    except Exception as err:
        response.add_error(
            ClientError(ClientErrorCodes.LEAGUE_API, str(err)))

    return response.resolve()
