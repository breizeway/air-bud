from ariadne import QueryType
from data import ClientBoxScore
from resources.league_api import LeagueApi
from resolvers.response import ClientError, ClientErrorCodes

query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(*_, year=None):
    league, response = LeagueApi(year).init()

    try:
        box_scores = league.box_scores()
        response_data = {"box_scores": map(
            lambda box_score: ClientBoxScore(box_score), box_scores)}
        return response.resolve(response_data)
    except Exception as err:
        response.add_error(
            ClientError(ClientErrorCodes.LEAGUE_API, str(err)))

    return response.resolve()
