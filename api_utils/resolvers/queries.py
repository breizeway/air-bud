from ariadne import QueryType
from api_utils.data import ClientBoxScore
from api_utils.league import init_league

query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(_, info):
    league = init_league()
    box_scores = league.box_scores()
    return map(lambda box_score: ClientBoxScore(box_score), box_scores)
