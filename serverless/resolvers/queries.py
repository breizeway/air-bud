from ariadne import QueryType
from data import ClientBoxScore
from league import init_league

query = QueryType()


@query.field("getBoxScores")
def resolve_get_box_scores(*_, league_config):
    league = init_league(league_config)
    box_scores = league.box_scores()
    return map(lambda box_score: ClientBoxScore(box_score), box_scores)
