from ariadne import QueryType
from espn_api.basketball import League
from api_utils.data import ClientBoxScore
import os

league = QueryType()


@league.field("getBoxScores")
def resolve_get_box_scores(_, info):
    league = League(league_id=os.environ["LEAGUE_ID"], year=2024, espn_s2="AEBkULgGKd5WK77vZ38D88yxOqSO1KyaRtKNNwHxO%2FVDWwFu7f8CfpHIy84MUJWwi7kwcv6wA0NphH%2Ff2lXwVYH8lEnKzlWet3iYb1ZqbwzClJzwVM6QhRP9bQYIzngfztjasDeDxlM%2FA%2BZVLJR2mrPpcbUm2diqnxvXo7FkHyn6M%2FWu0qbVUbcYwUKsOFL3KrgUjLaDcN8406Izy2oqb4RG60IvDRh3X2trqIcTP5U%2FQ9RUAGGw%2BNUwc82dgXzG%2F5JjfshRwc3a5BOaDi2BKBW7",
                    swid="{3872DC0C-8931-4C30-A0FD-F9AD7CA4C739}")
    box_scores = league.box_scores()
    return map(lambda box_score: ClientBoxScore(box_score), box_scores)
