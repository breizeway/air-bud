from ariadne import QueryType
from data import ClientBoxScore
from resources.league_api import LeagueApi
import json
from typing import List
from espn_api.basketball.box_score import BoxScore

query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(*_, year=None):
    def getBoxScores(league):
        box_scores: List[BoxScore] = league.box_scores()

        print("BOX_SCORES: ", json.dumps(box_scores.__dict__))
        return {"box_scores": map(lambda box_score: ClientBoxScore(box_score), box_scores)}

    return LeagueApi(year).make_request(getBoxScores)
