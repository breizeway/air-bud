import {
  BoxPlayer,
  BoxStat,
  PlayerStat,
  RankQueryBoxScoreFragment,
  Stat,
} from "@/gql/graphql";
import { RankQueryBoxScore } from "./queries";
import { FragmentType, useFragment } from "@/gql";
import { TLSSocket } from "tls";

export enum BoxStatCategories {
  "PTS" = "PTS",
  "BLK" = "BLK",
  "3PTM" = "3PTM",
  "STL" = "STL",
  "AST" = "AST",
  "REB" = "REB",
  "PF" = "PF",
  "TO" = "TO",
  "FGM" = "FGM",
  "FGA" = "FGA",
  "ALL" = "ALL",
}

interface TeamStat {
  teamName: string;
  value: number;
  rank?: number;
  score?: number;
}
type StatsByCat<T> = {
  [Category in BoxStatCategories]: T[];
};
const initStatsByCat = <T>(): StatsByCat<T> => ({
  PTS: [],
  BLK: [],
  "3PTM": [],
  STL: [],
  AST: [],
  REB: [],
  PF: [],
  TO: [],
  FGM: [],
  FGA: [],
  // important that this one is last to make rankings work with only one iteration

  ALL: [],
});

type RankedBoxScore = {
  teamName: string;
} & { [category in BoxStatCategories]: TeamStat };

const breakOutTeamStats = (
  boxRanks: StatsByCat<TeamStat>,
  boxStats: BoxStat[],
  playerLineup:
    | RankQueryBoxScoreFragment["homeLineup"]
    | RankQueryBoxScoreFragment["awayLineup"],
  teamName: string
) => {
  if (playerLineup.length) {
    // accum player stats for live scores from the current week
    const playerStats = playerLineup.reduce((acc: StatsByCat<number>, pl) => {
      pl?.pointsBreakdown.forEach((pb) => {
        const cat = pb.category as BoxStatCategories;
        if (acc[cat]) acc[cat].push(pb.value ?? 0);
      });
      return acc;
    }, initStatsByCat<number>());
    Object.entries(playerStats).forEach(([category, vals]) => {
      const cat = category as BoxStatCategories;
      const value = vals.reduce((acc, val) => acc + val, 0);
      boxRanks[cat]?.push({ teamName, value });
    });
  } else {
    // static (non-live) box scores for prior weeks
    boxStats.forEach((bs) => {
      const cat = bs.category as BoxStatCategories;
      boxRanks[cat]?.push({ teamName, value: bs.value });
    });
  }
};

export const getRankedBoxScores = (
  boxScores: FragmentType<typeof RankQueryBoxScore>[] | undefined | null
) => {
  if (boxScores) {
    const teamStats = boxScores.reduce((acc: StatsByCat<TeamStat>, bs) => {
      const boxScore = useFragment(RankQueryBoxScore, bs);

      breakOutTeamStats(
        acc,
        boxScore.homeStats,
        boxScore.homeLineup,
        boxScore.homeTeam.teamName
      );
      breakOutTeamStats(
        acc,
        boxScore.awayStats,
        boxScore.awayLineup,
        boxScore.awayTeam.teamName
      );

      return acc;
    }, initStatsByCat<TeamStat>());

    const rankedBoxScoresByTeam = Object.keys(teamStats).reduce(
      (acc: { [teamName: string]: Partial<RankedBoxScore> }, k) => {
        const key = k as BoxStatCategories;

        teamStats[key]?.sort((a, b) => {
          if (!(key === BoxStatCategories.PF || key === BoxStatCategories.TO))
            return b.value - a.value;
          return a.value - b.value;
        });

        teamStats[key].forEach((ts, idx) => {
          const rank = idx + 1;
          const score = 10 - idx;
          Object.assign(ts, { rank, score });

          const allStatIdx = teamStats[BoxStatCategories.ALL].findIndex(
            (bts) => bts.teamName === ts.teamName
          );

          if (key !== BoxStatCategories.ALL) {
            teamStats[BoxStatCategories.ALL][allStatIdx].value += score;
          }

          if (!acc[ts.teamName]) acc[ts.teamName] = {};
          acc[ts.teamName][key] = ts;
        });

        return acc;
      },
      {}
    );

    return rankedBoxScoresByTeam;
  }
};
