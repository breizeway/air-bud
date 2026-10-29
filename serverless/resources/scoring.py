"""
Leaderboard scoring engine.

Given one ESPN matchup period's box scores, produce the ranked table the client
renders: for every team, a value + rank + score in each category, plus an
overall ALL column (the sum of a team's per-category scores).

Every league simply displays its OWN scoring categories, exactly as ESPN returns
them (cumulativeScore.scoreByStat), with ESPN's precalculated values. No derived
or substituted categories.

The only non-scoring column is MIN (minutes): a shown-but-unscored extra summed
from player breakdowns, available only on the current week.

Pipeline
--------
    scoreByStat (the league's categories + precalc values)
        ─▶ rank each category (desc; TO/PF asc) ─▶ 0..10 score
                                                        │
                                                        ▼
                                      ALL = Σ scored-category scores

    ORDER MATTERS: every scored category is ranked and scored BEFORE ALL is
    ranked, because ALL's value is the sum of those scores.
"""
from data import ClientOwner

# Minutes: shown and ranked, never counted toward ALL. From player breakdowns,
# so only present on the current week (a completed week's scoreByStat has no MIN).
MINUTES = "MIN"

# Column order for known categories; anything else is appended (sorted) before ALL.
DISPLAY_ORDER = [MINUTES, "FG%", "FT%", "3PM", "REB", "AST", "STL", "BLK", "TO", "PTS"]

# Categories where lower is better.
LOWER_IS_BETTER = {"TO", "PF"}

ALL = "ALL"


def _is_pct(category):
    return category.endswith("%")


def _format(category, value):
    if category == ALL:
        return str(int(round(value)))
    if _is_pct(category):
        # ESPN percentages are 0..1; render ".456" (drop the leading zero).
        return f"{value:.3f}".lstrip("0") if value else "0"
    return str(int(round(value)))


def _sides(box_scores):
    """Yield (team, stats, lineup) for each real side. Bye sides are int 0."""
    for bs in box_scores:
        if not isinstance(bs.home_team, int):
            yield bs.home_team, bs.home_stats, bs.home_lineup
        if not isinstance(bs.away_team, int):
            yield bs.away_team, bs.away_stats, bs.away_lineup


def _scored_categories(sides):
    """The league's scoring categories, straight from its own scoreByStat."""
    scored = set()
    for _team, stats, _lineup in sides:
        scored.update(stats.keys())
    return scored


def _minutes_available(sides):
    for _team, _stats, lineup in sides:
        for player in lineup:
            if MINUTES in (player.points_breakdown or {}):
                return True
    return False


def _order(categories):
    ordered = [c for c in DISPLAY_ORDER if c in categories]
    ordered += sorted(c for c in categories if c not in DISPLAY_ORDER)
    return ordered


def _team_values(stats, lineup, scored, show_minutes):
    values = {cat: (stats.get(cat) or {}).get("value", 0) for cat in scored}
    if show_minutes:
        values[MINUTES] = sum(
            (player.points_breakdown or {}).get(MINUTES, 0) or 0
            for player in lineup)
    return values


def _rank(entries, ascending):
    """entries: [(team_id, value)] -> {team_id: (rank, score)}.

    rank: 1-based, ties share a rank. score: 10 for 1st down to 1 for 10th, 0
    when the value is 0; ties share a score.
    """
    entries = sorted(entries, key=lambda e: e[1], reverse=not ascending)
    out = {}
    prev_value = prev_rank = prev_score = None
    for idx, (team_id, value) in enumerate(entries):
        tied = value == prev_value
        rank = prev_rank if tied else idx + 1
        if value == 0:
            score = 0
        elif tied:
            score = prev_score
        else:
            score = max(10 - idx, 0)
        out[team_id] = (rank, score)
        prev_value, prev_rank, prev_score = value, rank, score
    return out


class LeaderboardCell:
    def __init__(self, category, display, rank, score):
        self.category = category
        self.display = display
        self.rank = rank
        self.score = score


class LeaderboardRow:
    def __init__(self, team, cells):
        self.team_name = team.team_name
        self.standing = team.standing
        self.owners = [ClientOwner(owner) for owner in team.owners]
        self.cells = cells


class LeaderboardCategory:
    def __init__(self, name, scored):
        self.name = name
        self.scored = scored


class Leaderboard:
    def __init__(self, league_index, league_name, current_matchup_period,
                 matchup_period, is_live, categories, rows):
        self.league_index = league_index
        self.league_name = league_name
        self.current_matchup_period = current_matchup_period
        self.matchup_period = matchup_period
        self.is_live = is_live
        self.categories = categories
        self.rows = rows


def build_leaderboard(box_scores, league_index, league_name,
                      current_matchup_period, matchup_period):
    sides = list(_sides(box_scores))
    scored = _scored_categories(sides)
    show_minutes = _minutes_available(sides)
    ordered = _order(scored | ({MINUTES} if show_minutes else set()))

    team_values = {
        team.team_id: _team_values(stats, lineup, scored, show_minutes)
        for team, stats, lineup in sides
    }

    # cells[team_id][category] = {"value", "rank", "score"}
    cells = {team_id: {} for team_id in team_values}
    all_value = {team_id: 0 for team_id in team_values}

    # Rank and score every category FIRST, accumulating ALL from scored ones only.
    for cat in ordered:
        ranked = _rank([(tid, vals.get(cat, 0)) for tid, vals in team_values.items()],
                       ascending=cat in LOWER_IS_BETTER)
        for team_id, vals in team_values.items():
            value = vals.get(cat, 0)
            rank, score = ranked[team_id]
            cells[team_id][cat] = {"value": value, "rank": rank, "score": score}
            if cat in scored:
                all_value[team_id] += score

    # Then rank ALL off the accumulated totals.
    all_ranked = _rank(list(all_value.items()), ascending=False)
    for team_id, total in all_value.items():
        rank, _score = all_ranked[team_id]
        cells[team_id][ALL] = {"value": total, "rank": rank, "score": total}

    display_categories = ordered + [ALL]
    category_defs = [LeaderboardCategory(cat, cat in scored)
                     for cat in display_categories]

    rows = []
    for team, _stats, _lineup in sides:
        row_cells = [
            LeaderboardCell(cat, _format(cat, cells[team.team_id][cat]["value"]),
                            cells[team.team_id][cat]["rank"],
                            cells[team.team_id][cat]["score"])
            for cat in display_categories
        ]
        rows.append(LeaderboardRow(team, row_cells))

    is_live = matchup_period == current_matchup_period and any(
        (player.game_played or 0) != 100
        for _team, _stats, lineup in sides for player in lineup
    )

    return Leaderboard(league_index, league_name, current_matchup_period,
                       matchup_period, is_live, category_defs, rows)
