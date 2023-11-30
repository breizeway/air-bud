from ariadne import QueryType
from espn_api.basketball import League
from espn_api.basketball.box_score import BoxScore, STATS_MAP
import os

league = QueryType()


class ApiBoxScore:
    def __init__(self, box_score: BoxScore):
        self.winner = box_score.winner
        self.home_team = box_score.home_team
        self.home_wins = box_score.home_wins
        self.home_ties = box_score.home_ties
        self.home_losses = box_score.home_losses
        self.home_stats = listify_box_stats(box_score.home_stats)
        self.away_team = box_score.away_team
        self.away_wins = box_score.away_wins
        self.away_ties = box_score.away_ties
        self.away_losses = box_score.away_losses
        self.away_stats = listify_box_stats(box_score.away_stats)
        self.home_lineup = box_score.home_lineup
        self.away_lineup = box_score.away_lineup


def listify_box_stats(box_stats: STATS_MAP):
    result = list()
    for k, v in box_stats.items():
        result.append({"category": k, **v})
    return result


@league.field("getBoxScores")
def resolve_get_box_scores(_, info):
    league = League(league_id=os.environ["LEAGUE_ID"], year=2024, espn_s2="AEBkULgGKd5WK77vZ38D88yxOqSO1KyaRtKNNwHxO%2FVDWwFu7f8CfpHIy84MUJWwi7kwcv6wA0NphH%2Ff2lXwVYH8lEnKzlWet3iYb1ZqbwzClJzwVM6QhRP9bQYIzngfztjasDeDxlM%2FA%2BZVLJR2mrPpcbUm2diqnxvXo7FkHyn6M%2FWu0qbVUbcYwUKsOFL3KrgUjLaDcN8406Izy2oqb4RG60IvDRh3X2trqIcTP5U%2FQ9RUAGGw%2BNUwc82dgXzG%2F5JjfshRwc3a5BOaDi2BKBW7",
                    swid="{3872DC0C-8931-4C30-A0FD-F9AD7CA4C739}")
    box_scores = league.box_scores()
    return map(lambda box_score: ApiBoxScore(box_score), box_scores)
