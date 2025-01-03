import { TEAM_NAME_ADJS, TEAM_NAME_NOUNS } from "@/constants";
import { FragmentType, useFragment } from "@/gql";
import {
  BoxScoreFragmentFragment,
  BoxStat,
  TeamFragmentFragment,
} from "@/gql/graphql";
import { isToday } from "date-fns";
import { LeaderboardOptions } from ".";
import { BoxScoreFragment, TeamFragment } from "./queries";

export enum BoxStatCategories {
  "MIN" = "MIN",
  "FGA" = "FGA",
  "FGM" = "FGM",
  "FG%" = "FG%",
  "FTA" = "FTA",
  "FTM" = "FTM",
  "FT%" = "FT%",
  "3PM" = "3PM",
  "REB" = "REB",
  "AST" = "AST",
  "STL" = "STL",
  "BLK" = "BLK",
  "TO" = "TO",
  // "PF" = "PF",
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
  MIN: [],
  FGA: [],
  FGM: [],
  "FG%": [],
  FTA: [],
  FTM: [],
  "FT%": [],
  "3PM": [],
  REB: [],
  AST: [],
  STL: [],
  BLK: [],
  TO: [],
  // PF: [],
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
  const isNegativeStat = [
    BoxStatCategories.TO,
    // , BoxStatCategories.PF
  ].includes(category);
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
    | BoxScoreFragmentFragment["homeLineup"]
    | BoxScoreFragmentFragment["awayLineup"],
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
    const freeThrows = { FTM: 0, FTA: 0 };
    Object.entries(playerStats).forEach(([category, vals]) => {
      const cat = category as BoxStatCategories;
      const value = vals.reduce((acc, val) => acc + val, 0);

      if (cat === BoxStatCategories["FGM"]) fieldGoals.FGM = value;
      if (cat === BoxStatCategories["FGA"]) fieldGoals.FGA = value;
      if (cat === BoxStatCategories["FTM"]) freeThrows.FTM = value;
      if (cat === BoxStatCategories["FTA"]) freeThrows.FTA = value;
      if (![BoxStatCategories["FG%"], BoxStatCategories["FT%"]].includes(cat))
        boxRanks[cat]?.push({ ...teamStats, value });
    });

    boxRanks[BoxStatCategories["FG%"]]?.push({
      ...teamStats,
      value: fieldGoals.FGA === 0 ? 0 : fieldGoals.FGM / fieldGoals.FGA,
    });
    boxRanks[BoxStatCategories["FT%"]]?.push({
      ...teamStats,
      value: freeThrows.FTA === 0 ? 0 : freeThrows.FTM / freeThrows.FTA,
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

const getTeamName = (team: TeamFragmentFragment, sfwMode: boolean) => {
  let teamName = team.teamName.trim();
  if (sfwMode) {
    const firstName = team.owners.at(0)?.firstName ?? "";
    teamName = `${firstName}'s ${getTeamAdj(firstName)} ${getTeamNoun(
      firstName
    )}`;
  }
  return teamName;
};

export const getRankedBoxScores = (
  boxScores: FragmentType<typeof BoxScoreFragment>[] | undefined | null,
  leaderboardOptions: LeaderboardOptions
): RankedBoxScores | undefined => {
  if (boxScores) {
    const teamStats = boxScores.reduce((acc: StatsByCat<TeamStat>, bs) => {
      const boxScore = useFragment(BoxScoreFragment, bs);
      const homeTeam = useFragment(TeamFragment, boxScore.homeTeam);
      const awayTeam = useFragment(TeamFragment, boxScore.awayTeam);
      breakOutTeamStats(
        acc,
        boxScore.homeStats,
        boxScore.homeLineup,
        getTeamName(homeTeam, leaderboardOptions.sfwMode),
        homeTeam.standing,
        leaderboardOptions
      );
      breakOutTeamStats(
        acc,
        boxScore.awayStats,
        boxScore.awayLineup,
        getTeamName(awayTeam, leaderboardOptions.sfwMode),
        awayTeam.standing,
        leaderboardOptions
      );

      return acc;
    }, initStatsByCat<TeamStat>());

    const rankedBoxScoresByTeam = Object.keys(teamStats).reduce(
      (acc: { [teamName: string]: RankedBoxScore }, k) => {
        const key = k as BoxStatCategories;

        teamStats[key]?.sort((a, b) => {
          if (
            !(
              // key === BoxStatCategories.PF ||
              (key === BoxStatCategories.TO)
            )
          )
            return b.value - a.value;
          return a.value - b.value;
        });

        teamStats[key].forEach((ts, idx, arr) => {
          const isTied = ts.value === arr[idx - 1]?.value;
          const rank = isTied ? arr[idx - 1]?.rank ?? 0 : idx + 1;
          const score =
            // cat shouldn't count toward total
            [
              BoxStatCategories.FGM,
              BoxStatCategories.FGA,
              BoxStatCategories.FTM,
              BoxStatCategories.FTA,
              BoxStatCategories.MIN,
            ].includes(key) || ts.value === 0 // cat values are 0
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

const teamAdjCache: { [ownerFirstName: string]: string } = {};
const getTeamAdj = (ownerFirstName: string) => {
  const cachedAdj = teamAdjCache[ownerFirstName];
  if (cachedAdj) return cachedAdj;
  else {
    const teamAdj =
      TEAM_NAME_ADJS.at(
        Math.round(Math.random() * (TEAM_NAME_ADJS.length - 1))
      ) ?? "";
    teamAdjCache[ownerFirstName] = teamAdj;
    return teamAdj;
  }
};

const teamNounCache: { [ownerFirstName: string]: string } = {};
const getTeamNoun = (ownerFirstName: string) => {
  const cachedNoun = teamNounCache[ownerFirstName];
  if (cachedNoun) return cachedNoun;
  else {
    const teamNoun =
      TEAM_NAME_NOUNS.at(
        Math.round(Math.random() * (TEAM_NAME_NOUNS.length - 1))
      ) ?? "";
    teamNounCache[ownerFirstName] = teamNoun;
    return teamNoun;
  }
};

export const findGameInProgress = (
  lineup: BoxScoreFragmentFragment["homeLineup" | "awayLineup"]
): boolean => {
  return !!lineup.find((boxPlayer) => {
    const { gamePlayed, schedule } = boxPlayer ?? {};
    return (
      gamePlayed === 0 &&
      !!schedule?.find((gd) => {
        const gameDate = new Date(gd);
        return (
          isToday(gameDate) && !!(gameDate.getTime() <= new Date().getTime())
        );
      })
    );
  });
};
