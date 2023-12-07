from ariadne import QueryType
from data import ClientBoxScore
from resources.league_api import LeagueApi
import json
from typing import List
from espn_api.basketball.box_score import BoxScore
from espn_api.basketball import League

query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(*_, year=None):
    def getBoxScores(league: League):
        box_scores = league.box_scores()

        for bs in box_scores:
            for (k, v) in bs:
                print({"key": k, "value": str(v)})
        return {"box_scores": map(lambda box_score: ClientBoxScore(box_score), box_scores)}

    return LeagueApi(year).make_request(getBoxScores)
