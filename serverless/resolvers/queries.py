from ariadne import QueryType
from data import ClientBoxScore
from resources.league_api import LeagueApi

query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(*_, league_auth, year=None):
    def getBoxScores(league):
        box_scores = league.box_scores()
        return {"box_scores": map(lambda box_score: ClientBoxScore(box_score), box_scores)}

    return LeagueApi(league_auth, year).make_request(getBoxScores)
