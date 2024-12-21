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
  /** datetime of when the game starts */
  gameDate?: Maybe<Scalars['String']['output']>;
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

export type LeagueAuthInput = {
  espn_s2: Scalars['String']['input'];
  swid: Scalars['String']['input'];
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
};


export type QueryGetBoxScoresArgs = {
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

export type TeamFragmentFragment = { __typename?: 'Team', teamName: string, standing: number, owners: Array<{ __typename?: 'Owner', firstName: string, displayName: string }> } & { ' $fragmentName'?: 'TeamFragmentFragment' };

export type BoxScoreFragmentFragment = { __typename?: 'BoxScore', winner: string, homeTeam: (
    { __typename?: 'Team' }
    & { ' $fragmentRefs'?: { 'TeamFragmentFragment': TeamFragmentFragment } }
  ), homeStats: Array<{ __typename?: 'BoxStat', category: string, value: number, result?: string | null }>, homeLineup: Array<{ __typename?: 'BoxPlayer', name: string, slotPosition: string, points: number, proOpponent: string, gamePlayed: number, gameDate?: string | null, pointsBreakdown: Array<{ __typename?: 'Stat', category: string, value?: number | null }> } | null>, awayTeam: (
    { __typename?: 'Team' }
    & { ' $fragmentRefs'?: { 'TeamFragmentFragment': TeamFragmentFragment } }
  ), awayStats: Array<{ __typename?: 'BoxStat', category: string, value: number, result?: string | null }>, awayLineup: Array<{ __typename?: 'BoxPlayer', name: string, slotPosition: string, points: number, proOpponent: string, gamePlayed: number, gameDate?: string | null, pointsBreakdown: Array<{ __typename?: 'Stat', category: string, value?: number | null }> } | null> } & { ' $fragmentName'?: 'BoxScoreFragmentFragment' };

export type GetBoxScoresQueryVariables = Exact<{
  year?: InputMaybe<Scalars['Int']['input']>;
  matchupPeriodOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetBoxScoresQuery = { __typename?: 'Query', getBoxScores: { __typename: 'GetBoxScoresResult', success: boolean, currentMatchupPeriod?: number | null, errors: Array<{ __typename?: 'Error', code: ErrorCodes, message: string } | null>, boxScores?: Array<(
      { __typename?: 'BoxScore' }
      & { ' $fragmentRefs'?: { 'BoxScoreFragmentFragment': BoxScoreFragmentFragment } }
    )> | null } };

export const TeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Team"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamName"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"owners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<TeamFragmentFragment, unknown>;
export const BoxScoreFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BoxScoreFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BoxScore"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"homeStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}},{"kind":"Field","name":{"kind":"Name","value":"homeLineup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slotPosition"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"proOpponent"}},{"kind":"Field","name":{"kind":"Name","value":"gamePlayed"}},{"kind":"Field","name":{"kind":"Name","value":"gameDate"}},{"kind":"Field","name":{"kind":"Name","value":"pointsBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayLineup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slotPosition"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"proOpponent"}},{"kind":"Field","name":{"kind":"Name","value":"gamePlayed"}},{"kind":"Field","name":{"kind":"Name","value":"gameDate"}},{"kind":"Field","name":{"kind":"Name","value":"pointsBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Team"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamName"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"owners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<BoxScoreFragmentFragment, unknown>;
export const SetLeagueAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setLeagueAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"leagueAuth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LeagueAuthInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setLeagueAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"leagueAuth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"leagueAuth"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SetLeagueAuthMutation, SetLeagueAuthMutationVariables>;
export const GetBoxScoresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBoxScores"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"matchupPeriodOffset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBoxScores"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"matchupPeriodOffset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"matchupPeriodOffset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boxScores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BoxScoreFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentMatchupPeriod"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Team"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamName"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"owners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BoxScoreFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BoxScore"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"homeStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}},{"kind":"Field","name":{"kind":"Name","value":"homeLineup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slotPosition"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"proOpponent"}},{"kind":"Field","name":{"kind":"Name","value":"gamePlayed"}},{"kind":"Field","name":{"kind":"Name","value":"gameDate"}},{"kind":"Field","name":{"kind":"Name","value":"pointsBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayLineup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slotPosition"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"proOpponent"}},{"kind":"Field","name":{"kind":"Name","value":"gamePlayed"}},{"kind":"Field","name":{"kind":"Name","value":"gameDate"}},{"kind":"Field","name":{"kind":"Name","value":"pointsBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<GetBoxScoresQuery, GetBoxScoresQueryVariables>;