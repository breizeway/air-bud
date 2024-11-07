/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n      mutation setLeagueAuth($leagueAuth: LeagueAuthInput!) {\n        setLeagueAuth(leagueAuth: $leagueAuth) {\n          __typename\n          success\n          errors {\n            code\n            message\n          }\n        }\n      }\n    ": types.SetLeagueAuthDocument,
    "\n  fragment TeamFragment on Team {\n    teamName\n    standing\n    owners {\n      firstName\n      displayName\n    }\n  }\n": types.TeamFragmentFragmentDoc,
    "\n  fragment BoxScoreFragment on BoxScore {\n    winner\n    homeTeam {\n      ...TeamFragment\n    }\n    homeStats {\n      category\n      value\n      result\n    }\n    homeLineup {\n      pointsBreakdown {\n        category\n        value\n      }\n    }\n    awayTeam {\n      ...TeamFragment\n    }\n    awayStats {\n      category\n      value\n      result\n    }\n    awayLineup {\n      pointsBreakdown {\n        category\n        value\n      }\n    }\n  }\n": types.BoxScoreFragmentFragmentDoc,
    "\n  query getBoxScores($year: Int, $matchupPeriodOffset: Int) {\n    getBoxScores(year: $year, matchupPeriodOffset: $matchupPeriodOffset) {\n      __typename\n      success\n      errors {\n        code\n        message\n      }\n      boxScores {\n        ...BoxScoreFragment\n      }\n      currentMatchupPeriod\n    }\n  }\n": types.GetBoxScoresDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation setLeagueAuth($leagueAuth: LeagueAuthInput!) {\n        setLeagueAuth(leagueAuth: $leagueAuth) {\n          __typename\n          success\n          errors {\n            code\n            message\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation setLeagueAuth($leagueAuth: LeagueAuthInput!) {\n        setLeagueAuth(leagueAuth: $leagueAuth) {\n          __typename\n          success\n          errors {\n            code\n            message\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TeamFragment on Team {\n    teamName\n    standing\n    owners {\n      firstName\n      displayName\n    }\n  }\n"): (typeof documents)["\n  fragment TeamFragment on Team {\n    teamName\n    standing\n    owners {\n      firstName\n      displayName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BoxScoreFragment on BoxScore {\n    winner\n    homeTeam {\n      ...TeamFragment\n    }\n    homeStats {\n      category\n      value\n      result\n    }\n    homeLineup {\n      pointsBreakdown {\n        category\n        value\n      }\n    }\n    awayTeam {\n      ...TeamFragment\n    }\n    awayStats {\n      category\n      value\n      result\n    }\n    awayLineup {\n      pointsBreakdown {\n        category\n        value\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BoxScoreFragment on BoxScore {\n    winner\n    homeTeam {\n      ...TeamFragment\n    }\n    homeStats {\n      category\n      value\n      result\n    }\n    homeLineup {\n      pointsBreakdown {\n        category\n        value\n      }\n    }\n    awayTeam {\n      ...TeamFragment\n    }\n    awayStats {\n      category\n      value\n      result\n    }\n    awayLineup {\n      pointsBreakdown {\n        category\n        value\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getBoxScores($year: Int, $matchupPeriodOffset: Int) {\n    getBoxScores(year: $year, matchupPeriodOffset: $matchupPeriodOffset) {\n      __typename\n      success\n      errors {\n        code\n        message\n      }\n      boxScores {\n        ...BoxScoreFragment\n      }\n      currentMatchupPeriod\n    }\n  }\n"): (typeof documents)["\n  query getBoxScores($year: Int, $matchupPeriodOffset: Int) {\n    getBoxScores(year: $year, matchupPeriodOffset: $matchupPeriodOffset) {\n      __typename\n      success\n      errors {\n        code\n        message\n      }\n      boxScores {\n        ...BoxScoreFragment\n      }\n      currentMatchupPeriod\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;