import json
import math
from datetime import date, datetime
from zoneinfo import ZoneInfo

from espn_api.basketball.box_player import BoxPlayer
from espn_api.basketball.box_score import STATS_MAP, BoxScore
from espn_api.basketball.player import Player
from espn_api.basketball.team import Team


def serialize_dict(box_stats: STATS_MAP, key_name: str):
    result = list()
    for k, v in box_stats.items():
        result.append({key_name: k, **v})
    return result


def listify_stats(stats: STATS_MAP):
    result = list()
    for k, v in stats.items() or dict():
        val = float(v)
        result.append({"category": k, "value": val if math.isfinite(val) else None})
    return result


def listify_schedule(schedule: dict):
    result = list()
    for v in schedule.values():
        result.append(v["date"].astimezone(ZoneInfo("UTC")).isoformat())
    return result


class ClientPlayerStat:
    def __init__(self, player_stat: STATS_MAP):
        self.scoring_period = player_stat["scoring_period"]
        self.applied_total = player_stat["applied_total"]
        self.applied_avg = player_stat["applied_avg"]
        self.team = player_stat["team"]
        self.date = player_stat["date"]
        if "total" in player_stat and player_stat["total"] is not None:
            self.total = listify_stats(player_stat["total"])
        if "avg" in player_stat and player_stat["avg"] is not None:
            self.avg = listify_stats(player_stat["avg"])


class ClientPlayer:
    def __init__(self, player: Player):
        self.name = player.name
        self.player_id = player.playerId
        self.eligible_slots = player.eligibleSlots
        self.pos_rank = player.posRank
        self.acquisition_type = player.acquisitionType
        self.pro_team = player.proTeam
        self.position = player.position
        self.injury_status = player.injuryStatus
        self.injured = player.injured
        self.stats = map(
            lambda player_stat: ClientPlayerStat(player_stat),
            serialize_dict(player.stats, "scoring_period"),
        )
        self.schedule = serialize_dict(player.schedule, "scoring_period")
        self.lineup_slot = player.lineupSlot
        self.total_points = player.total_points
        self.avg_points = player.avg_points
        self.projected_total_points = player.projected_total_points
        self.projected_avg_points = player.projected_avg_points


class ClientOwner:
    def __init__(self, owner: dict):
        self.id = owner.get("id")
        self.display_name = owner.get("displayName")
        self.first_name = owner.get("firstName")
        self.lastName = owner.get("lastName")


class ClientTeam:
    def __init__(self, team: Team):
        self.team_id = team.team_id
        self.team_abbrev = team.team_abbrev
        self.team_name = team.team_name
        self.division_id = team.division_id
        self.division_name = team.division_name
        self.wins = team.wins
        self.losses = team.losses
        self.ties = team.ties
        self.owners = map(lambda owner: ClientOwner(owner), team.owners)
        self.standing = team.standing
        self.final_standing = team.final_standing
        self.logo_url = team.logo_url
        self.roster = map(lambda player: ClientPlayer(player), team.roster)
        self.schedule = team.schedule


class ClientBoxPlayer:
    def __init__(self, box_player: BoxPlayer):
        self.name = box_player.name
        self.slot_position = box_player.slot_position
        self.points = box_player.points
        self.points_breakdown = listify_stats(box_player.points_breakdown)
        self.pro_opponent = box_player.pro_opponent
        self.game_played = box_player.game_played
        self.schedule = listify_schedule(box_player.schedule)


class ClientBoxScore:
    def __init__(self, box_score: BoxScore):
        self.winner = box_score.winner
        self.home_team = ClientTeam(box_score.home_team)
        self.home_wins = box_score.home_wins
        self.home_ties = box_score.home_ties
        self.home_losses = box_score.home_losses
        self.home_stats = serialize_dict(box_score.home_stats, "category")
        self.away_team = ClientTeam(box_score.away_team)
        self.away_wins = box_score.away_wins
        self.away_ties = box_score.away_ties
        self.away_losses = box_score.away_losses
        self.away_stats = serialize_dict(box_score.away_stats, "category")
        self.home_lineup = map(
            lambda box_player: ClientBoxPlayer(box_player), box_score.home_lineup
        )
        self.away_lineup = map(
            lambda box_player: ClientBoxPlayer(box_player), box_score.away_lineup
        )
