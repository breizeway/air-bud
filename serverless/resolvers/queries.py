from ariadne import QueryType
from data import ClientBoxScore
from league import init_league
from espn_api.requests.espn_requests import ESPNAccessDenied

query = QueryType()


class ClientError:
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message


@query.field("getBoxScores")
def resolve_get_box_scores(*_, league_config):
    def resolve(callback):
        try:
            league = init_league(league_config)
            return callback(league)
        except ESPNAccessDenied as err:
            print(":::ERR::: ", err)
            return {"client_errors": [ClientError("LEAGUE_AUTH", "League credentials not valid")]}

    def getBoxScores(league):
        box_scores = league.box_scores()
        return {"box_scores": map(lambda box_score: ClientBoxScore(box_score), box_scores)}

    return resolve(getBoxScores)
