import {
  BoxPlayer,
  BoxStat,
  PlayerStat,
  RankQueryBoxScoreFragment,
  Stat,
} from "@/gql/graphql";
import { RankQueryBoxScore } from "./queries";
import { FragmentType, useFragment } from "@/gql";

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
  "TOT" = "TOT",
}

interface CatTeamStat {
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
  TOT: [],
});

const breakOutTeamStats = (
  boxRanks: StatsByCat<CatTeamStat>,
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
    const teamStats = boxScores.reduce((acc: StatsByCat<CatTeamStat>, bs) => {
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
    }, initStatsByCat<CatTeamStat>());

    Object.keys(teamStats).forEach((k) => {
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
      });
    });

    return teamStats;
  }
};
