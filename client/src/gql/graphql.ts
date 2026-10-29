/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type BoxPlayer = {
  __typename?: 'BoxPlayer';
  /** 0 (not played/playing) or 100 (finished game) */
  gamePlayed: Scalars['Int']['output'];
  /** the player's name */
  name: Scalars['String']['output'];
  /** points scored in the current week */
  points: Scalars['Int']['output'];
  /** dict of points breakdown (PTS, BLK, AST, ...) */
  pointsBreakdown: Array<Stat>;
  /** the pro team the player is going against */
  proOpponent: Scalars['String']['output'];
  /** list of game dates */
  schedule: Array<Scalars['String']['output']>;
  /** the players lineup position */
  slotPosition: Scalars['String']['output'];
};

export type BoxScore = {
  __typename?: 'BoxScore';
  awayLineup: Array<Maybe<BoxPlayer>>;
  awayLosses: Scalars['Int']['output'];
  /** example {'AST': {'value': 14.0, 'result': 'LOSS'}, 'FG%': {'value': 0.50793651, 'result': 'WIN'}} */
  awayStats: Array<BoxStat>;
  awayTeam: Team;
  awayTies: Scalars['Int']['output'];
  awayWins: Scalars['Int']['output'];
  homeLineup: Array<Maybe<BoxPlayer>>;
  homeLosses: Scalars['Int']['output'];
  /** example {'PTS': {'value': 88.0, 'result': 'LOSS'}, 'BLK': {'value': 1.0, 'result': 'TIE'} } */
  homeStats: Array<BoxStat>;
  homeTeam: Team;
  homeTies: Scalars['Int']['output'];
  homeWins: Scalars['Int']['output'];
  /** HOME or AWAY */
  winner: Scalars['String']['output'];
};

export type BoxStat = {
  __typename?: 'BoxStat';
  category: Scalars['String']['output'];
  result?: Maybe<Scalars['String']['output']>;
  value: Scalars['Float']['output'];
};

export type Error = {
  __typename?: 'Error';
  code: ErrorCodes;
  message: Scalars['String']['output'];
};

export enum ErrorCodes {
  EdgeApi = 'EDGE_API',
  LeagueApi = 'LEAGUE_API',
  LeagueApiAuth = 'LEAGUE_API_AUTH'
}

export type GetBoxScoresResult = {
  __typename?: 'GetBoxScoresResult';
  boxScores?: Maybe<Array<BoxScore>>;
  currentMatchupPeriod?: Maybe<Scalars['Int']['output']>;
  errors: Array<Maybe<Error>>;
  success: Scalars['Boolean']['output'];
};

export type GetLeaderboardResult = {
  __typename?: 'GetLeaderboardResult';
  errors: Array<Maybe<Error>>;
  leaderboard?: Maybe<Leaderboard>;
  success: Scalars['Boolean']['output'];
};

export type GetLeaguesResult = {
  __typename?: 'GetLeaguesResult';
  errors: Array<Maybe<Error>>;
  leagues?: Maybe<Array<LeagueInfo>>;
  success: Scalars['Boolean']['output'];
};

export type Leaderboard = {
  __typename?: 'Leaderboard';
  /** columns to render, in display order (ALL is last) */
  categories: Array<LeaderboardCategory>;
  currentMatchupPeriod: Scalars['Int']['output'];
  /** true when this is the current week and a game is still in progress */
  isLive: Scalars['Boolean']['output'];
  leagueIndex: Scalars['Int']['output'];
  leagueName: Scalars['String']['output'];
  /** currentMatchupPeriod + requested offset */
  matchupPeriod: Scalars['Int']['output'];
  rows: Array<LeaderboardRow>;
};

export type LeaderboardCategory = {
  __typename?: 'LeaderboardCategory';
  name: Scalars['String']['output'];
  /** false for the ALL/overall column */
  scored: Scalars['Boolean']['output'];
};

export type LeaderboardCell = {
  __typename?: 'LeaderboardCell';
  category: Scalars['String']['output'];
  /** pre-formatted for display (e.g. '.456', '1.75', 'INF', '88') */
  display: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  /** 0-10 contribution to the ALL total (ALL's own score is its sum) */
  score: Scalars['Int']['output'];
};

export type LeaderboardRow = {
  __typename?: 'LeaderboardRow';
  /** one cell per category (same order as Leaderboard.categories) */
  cells: Array<LeaderboardCell>;
  owners: Array<Owner>;
  standing: Scalars['Int']['output'];
  teamName: Scalars['String']['output'];
};

export type LeagueAuthInput = {
  espn_s2: Scalars['String']['input'];
  swid: Scalars['String']['input'];
};

export type LeagueInfo = {
  __typename?: 'LeagueInfo';
  /** 1-based ordinal — maps to the /1, /2 URL and the leagueIndex arg */
  index: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Matchup = {
  __typename?: 'Matchup';
  awayFinal_score: Scalars['Int']['output'];
  awayTeam: Team;
  awayTeam_live_score?: Maybe<Scalars['Float']['output']>;
  homeFinal_score: Scalars['Int']['output'];
  homeTeam: Team;
  homeTeam_live_score?: Maybe<Scalars['Float']['output']>;
  winner: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  setLeagueAuth: SetLeagueAuthResult;
};


export type MutationSetLeagueAuthArgs = {
  leagueAuth: LeagueAuthInput;
};

export type Owner = {
  __typename?: 'Owner';
  displayName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
};

export type Player = {
  __typename?: 'Player';
  acquisitionType: Scalars['String']['output'];
  /** players average points during the season */
  avgPoints: Scalars['Int']['output'];
  eligibleSlots: Array<Scalars['String']['output']>;
  injured: Scalars['Boolean']['output'];
  injuryLeagueStatus?: Maybe<Scalars['String']['output']>;
  /** SG, C, PG, SF, IR */
  lineupSlot: Scalars['String']['output'];
  name: Scalars['String']['output'];
  playerId: Scalars['Int']['output'];
  /** players positional rank */
  posRank: Scalars['Int']['output'];
  position: Scalars['String']['output'];
  proTeam: Scalars['String']['output'];
  /** projected players average points for the season */
  projectedAvgPoints: Scalars['Int']['output'];
  /** projected player points for the season */
  projectedTotalPoints: Scalars['Int']['output'];
  /** key is scoring period, example: {'2': {'team': 'BKN', 'date': datetime.datetime(2018, 10, 17, 23, 0)}} */
  schedule: Array<Schedule>;
  /** example {'2': {'team': 'NYK', 'date': datetime.datetime(2019, 4, 11, 0, 0), 'total': {'PTS': 20.0, 'BLK': 0.0, 'AST': 3.0}}} */
  stats: Array<PlayerStat>;
  /** players total points during the season */
  totalPoints: Scalars['Int']['output'];
};

export type PlayerStat = {
  __typename?: 'PlayerStat';
  appliedAvg: Scalars['Float']['output'];
  appliedTotal: Scalars['Float']['output'];
  avg?: Maybe<Array<Stat>>;
  date?: Maybe<Scalars['String']['output']>;
  scoringPeriod: Scalars['String']['output'];
  team?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Array<Stat>>;
};

export type Query = {
  __typename?: 'Query';
  getBoxScores: GetBoxScoresResult;
  /** Fully-computed, ranked leaderboard table for one league + week. */
  getLeaderboard: GetLeaderboardResult;
  /** List of configured leagues (for the leaderboard tabs). index is 1-based (the /1, /2 URL). */
  getLeagues: GetLeaguesResult;
};


export type QueryGetBoxScoresArgs = {
  matchupPeriodOffset?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetLeaderboardArgs = {
  leagueIndex: Scalars['Int']['input'];
  matchupPeriodOffset?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type Schedule = {
  __typename?: 'Schedule';
  date: Scalars['String']['output'];
  scoringPeriod: Scalars['String']['output'];
  team: Scalars['String']['output'];
};

export type SetLeagueAuthResult = {
  __typename?: 'SetLeagueAuthResult';
  errors: Array<Maybe<Error>>;
  success: Scalars['Boolean']['output'];
};

export type Stat = {
  __typename?: 'Stat';
  category: Scalars['String']['output'];
  value?: Maybe<Scalars['Float']['output']>;
};

export type Team = {
  __typename?: 'Team';
  divisionId: Scalars['String']['output'];
  divisionName: Scalars['String']['output'];
  /** final standing at end of season */
  finalStanding: Scalars['Int']['output'];
  logoUrl: Scalars['String']['output'];
  losses: Scalars['Int']['output'];
  owners: Array<Owner>;
  roster: Array<Maybe<Player>>;
  schedule: Array<Maybe<Matchup>>;
  /** standing before playoffs */
  standing: Scalars['Int']['output'];
  teamAbbrev: Scalars['String']['output'];
  teamId: Scalars['Int']['output'];
  teamName: Scalars['String']['output'];
  ties: Scalars['Int']['output'];
  wins: Scalars['Int']['output'];
};

export type SetLeagueAuthMutationVariables = Exact<{
  leagueAuth: LeagueAuthInput;
}>;


export type SetLeagueAuthMutation = { __typename?: 'Mutation', setLeagueAuth: { __typename: 'SetLeagueAuthResult', success: boolean, errors: Array<{ __typename?: 'Error', code: ErrorCodes, message: string } | null> } };

export type GetLeaguesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLeaguesQuery = { __typename?: 'Query', getLeagues: { __typename?: 'GetLeaguesResult', success: boolean, errors: Array<{ __typename?: 'Error', code: ErrorCodes, message: string } | null>, leagues?: Array<{ __typename?: 'LeagueInfo', index: number, name: string }> | null } };

export type GetLeaderboardQueryVariables = Exact<{
  leagueIndex: Scalars['Int']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
  matchupPeriodOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetLeaderboardQuery = { __typename?: 'Query', getLeaderboard: { __typename?: 'GetLeaderboardResult', success: boolean, errors: Array<{ __typename?: 'Error', code: ErrorCodes, message: string } | null>, leaderboard?: { __typename?: 'Leaderboard', leagueIndex: number, leagueName: string, currentMatchupPeriod: number, matchupPeriod: number, isLive: boolean, categories: Array<{ __typename?: 'LeaderboardCategory', name: string, scored: boolean }>, rows: Array<{ __typename?: 'LeaderboardRow', teamName: string, standing: number, owners: Array<{ __typename?: 'Owner', firstName: string, displayName: string }>, cells: Array<{ __typename?: 'LeaderboardCell', category: string, display: string, rank: number, score: number }> }> } | null } };


export const SetLeagueAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setLeagueAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueAuth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LeagueAuthInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setLeagueAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueAuth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueAuth"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SetLeagueAuthMutation, SetLeagueAuthMutationVariables>;
export const GetLeaguesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLeagues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLeagues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leagues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetLeaguesQuery, GetLeaguesQueryVariables>;
export const GetLeaderboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLeaderboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueIndex"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"matchupPeriodOffset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLeaderboard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueIndex"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueIndex"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"matchupPeriodOffset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"matchupPeriodOffset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leaderboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leagueIndex"}},{"kind":"Field","name":{"kind":"Name","value":"leagueName"}},{"kind":"Field","name":{"kind":"Name","value":"currentMatchupPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"matchupPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scored"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamName"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"owners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cells"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetLeaderboardQuery, GetLeaderboardQueryVariables>;