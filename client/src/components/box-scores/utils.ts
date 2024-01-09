import { BoxStat, RankQueryBoxScoreFragment } from "@/gql/graphql";
import { RankQueryBoxScore } from "./queries";
import { FragmentType, useFragment } from "@/gql";

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

const breakOutTeamStats = (
  boxRanks: StatsByCat<TeamStat>,
  boxStats: BoxStat[],
  playerLineup:
    | RankQueryBoxScoreFragment["homeLineup"]
    | RankQueryBoxScoreFragment["awayLineup"],
  teamName: string,
  standing: number
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
      const value = vals.reduce((acc, val) => acc + val, 0);

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

export const getRankedBoxScores = (
  boxScores: FragmentType<typeof RankQueryBoxScore>[] | undefined | null
): RankedBoxScores | undefined => {
  if (boxScores) {
    const teamStats = boxScores.reduce((acc: StatsByCat<TeamStat>, bs) => {
      const boxScore = useFragment(RankQueryBoxScore, bs);

      breakOutTeamStats(
        acc,
        boxScore.homeStats,
        boxScore.homeLineup,
        boxScore.homeTeam.teamName.trim(),
        boxScore.homeTeam.standing
      );
      breakOutTeamStats(
        acc,
        boxScore.awayStats,
        boxScore.awayLineup,
        boxScore.awayTeam.teamName.trim(),
        boxScore.awayTeam.standing
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
          const rank = idx + 1;
          const score =
            key === BoxStatCategories.FGM ||
            key === BoxStatCategories.FGA ||
            // cat shouldn't count toward total
            (!(key === BoxStatCategories.TO || key === BoxStatCategories.PF) &&
              ts.value === 0)
              ? // cat values are 0
                0
              : ts.value === arr[idx - 1]?.value
              ? // cat values are tied
                arr[idx - 1]?.score ?? 0
              : 10 - idx;

          Object.assign(ts, { rank, score });

          const allStatIdx = teamStats[BoxStatCategories.ALL].findIndex(
            (bts) => bts.teamName === ts.teamName
          );

          if (key !== BoxStatCategories.ALL) {
            teamStats[BoxStatCategories.ALL][allStatIdx].value += score;
          }
          // if (key === BoxStatCategories.ALL) {
          //   (
          //     teamStats[BoxStatCategories.ALL][allStatIdx] as TeamStat<{
          //       standing: number;
          //     }>
          //   ).standing = ts.;
          // }

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
