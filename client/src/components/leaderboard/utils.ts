import { BoxStat, RankQueryBoxScoreFragment } from "@/gql/graphql";
import { RankQueryBoxScore } from "./queries";
import { FragmentType, useFragment } from "@/gql";
import { LeaderboardOptions } from ".";

export enum BoxStatCategories {
  "FGA" = "FGA",
  "FGM" = "FGM",
  "FG%" = "FG%",
  "3PTM" = "3PTM",
  "REB" = "REB",
  "AST" = "AST",
  "STL" = "STL",
  "BLK" = "BLK",
  "TO" = "TO",
  "PF" = "PF",
  "PTS" = "PTS",
  "ALL" = "ALL",
}

export type TeamStat = {
  teamName: string;
  standing: number;
  value: number;
  rank?: number;
  score?: number;
};
type StatsByCat<T> = {
  [Category in BoxStatCategories]: T[];
};
const initStatsByCat = <T>(): StatsByCat<T> => ({
  FGA: [],
  FGM: [],
  "FG%": [],
  "3PTM": [],
  REB: [],
  AST: [],
  STL: [],
  BLK: [],
  TO: [],
  PF: [],
  PTS: [],
  // important that this one is last to make rankings work with only one iteration
  ALL: [],
});

export type RankedBoxScore = { [category in BoxStatCategories]: TeamStat };
export type RankedBoxScores = { [teamName: string]: RankedBoxScore };

const alteredValue = (
  value: number,
  category: BoxStatCategories,
  teamName: string
) => {
  const isNegativeStat = [BoxStatCategories.TO, BoxStatCategories.PF].includes(
    category
  );
  const losers = ["All Starr Dawgs"];
  const winners = ["AirBalls Pro", "Durham Beans", "HAGA"];
  if (losers.includes(teamName)) {
    if (isNegativeStat) return Math.round(Math.random() * 1_000_000);
    return Math.round(Math.random() * 5);
  }
  if (winners.includes(teamName)) {
    if (isNegativeStat) return Math.round(Math.random() * 10);
    return Math.round(Math.random() * 300);
  }

  return value;
};

const breakOutTeamStats = (
  boxRanks: StatsByCat<TeamStat>,
  boxStats: BoxStat[],
  playerLineup:
    | RankQueryBoxScoreFragment["homeLineup"]
    | RankQueryBoxScoreFragment["awayLineup"],
  teamName: string,
  standing: number,
  leaderboardOptions: LeaderboardOptions
) => {
  const teamStats = { teamName, standing };
  if (playerLineup.length) {
    // accum player stats for live scores from the current week
    const playerStats = playerLineup.reduce((acc: StatsByCat<number>, pl) => {
      pl?.pointsBreakdown.forEach((pb) => {
        const cat = pb.category as BoxStatCategories;
        if (acc[cat]) acc[cat].push(pb.value ?? 0);
      });
      return acc;
    }, initStatsByCat<number>());

    const fieldGoals = { FGM: 0, FGA: 0 };
    Object.entries(playerStats).forEach(([category, vals]) => {
      const cat = category as BoxStatCategories;
      const actualValue = vals.reduce((acc, val) => acc + val, 0);
      const value = leaderboardOptions.cheat
        ? alteredValue(actualValue, cat, teamName)
        : actualValue;

      if (cat === BoxStatCategories["FGM"]) fieldGoals.FGM = value;
      if (cat === BoxStatCategories["FGA"]) fieldGoals.FGA = value;
      if (cat !== BoxStatCategories["FG%"])
        boxRanks[cat]?.push({ ...teamStats, value });
    });

    boxRanks[BoxStatCategories["FG%"]]?.push({
      ...teamStats,
      value: fieldGoals.FGA === 0 ? 0 : fieldGoals.FGM / fieldGoals.FGA,
    });
  } else {
    // static (non-live) box scores for prior weeks
    [...boxStats, { category: BoxStatCategories.ALL, value: 0 }].forEach(
      (bs) => {
        const cat = bs.category as BoxStatCategories;
        boxRanks[cat]?.push({ ...teamStats, value: bs.value });
      }
    );
  }
};

const alterTeamName = (teamName: string, safeMode: boolean) => {
  let trimmedTeamName = teamName.trim();
  if (safeMode) {
    trimmedTeamName = trimmedTeamName.replace("BigD ", "");
    trimmedTeamName = trimmedTeamName.replace(
      "Scott Likes Men",
      "Scott's Team Sucks"
    );
  }
  return trimmedTeamName;
};

export const getRankedBoxScores = (
  boxScores: FragmentType<typeof RankQueryBoxScore>[] | undefined | null,
  leaderboardOptions: LeaderboardOptions
): RankedBoxScores | undefined => {
  if (boxScores) {
    const teamStats = boxScores.reduce((acc: StatsByCat<TeamStat>, bs) => {
      const boxScore = useFragment(RankQueryBoxScore, bs);
      breakOutTeamStats(
        acc,
        boxScore.homeStats,
        boxScore.homeLineup,
        alterTeamName(boxScore.homeTeam.teamName, leaderboardOptions.safeMode),
        boxScore.homeTeam.standing,
        leaderboardOptions
      );
      breakOutTeamStats(
        acc,
        boxScore.awayStats,
        boxScore.awayLineup,
        alterTeamName(boxScore.awayTeam.teamName, leaderboardOptions.safeMode),
        boxScore.awayTeam.standing,
        leaderboardOptions
      );

      return acc;
    }, initStatsByCat<TeamStat>());

    const rankedBoxScoresByTeam = Object.keys(teamStats).reduce(
      (acc: { [teamName: string]: RankedBoxScore }, k) => {
        const key = k as BoxStatCategories;

        teamStats[key]?.sort((a, b) => {
          if (!(key === BoxStatCategories.PF || key === BoxStatCategories.TO))
            return b.value - a.value;
          return a.value - b.value;
        });

        teamStats[key].forEach((ts, idx, arr) => {
          const isTied = ts.value === arr[idx - 1]?.value;
          const rank = isTied ? arr[idx - 1]?.rank ?? 0 : idx + 1;
          const score =
            key === BoxStatCategories.FGM ||
            key === BoxStatCategories.FGA ||
            // cat shouldn't count toward total
            ts.value === 0 // cat values are 0
              ? 0
              : isTied
              ? arr[idx - 1]?.score ?? 0
              : 10 - idx;

          Object.assign(ts, { rank, score });

          const allStatIdx = teamStats[BoxStatCategories.ALL].findIndex(
            (bts) => bts.teamName === ts.teamName
          );

          if (key !== BoxStatCategories.ALL) {
            teamStats[BoxStatCategories.ALL][allStatIdx].value += score;
          }

          if (!acc[ts.teamName])
            Object.assign(acc, { [ts.teamName]: { [key]: ts } });
          else acc[ts.teamName][key] = ts;
        });

        return acc;
      },
      {}
    );

    return rankedBoxScoresByTeam;
  }
};
