from ariadne import QueryType
from data import ClientBoxScore
from league import PrivateLeague
from espn_api.requests.espn_requests import ESPNAccessDenied

query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(*_, league_config):
    def getBoxScores(league):
        box_scores = league.box_scores()
        return {"box_scores": map(lambda box_score: ClientBoxScore(box_score), box_scores)}

    return PrivateLeague(league_config).makeRequest(getBoxScores)
