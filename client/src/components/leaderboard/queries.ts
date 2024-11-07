import { graphql } from "../../gql";

export const TeamFragment = graphql(`
  fragment TeamFragment on Team {
    teamName
    standing
    owners {
      firstName
      displayName
    }
  }
`);

export const BoxScoreFragment = graphql(`
  fragment BoxScoreFragment on BoxScore {
    winner
    homeTeam {
      ...TeamFragment
    }
    homeStats {
      category
      value
      result
    }
    homeLineup {
      pointsBreakdown {
        category
        value
      }
    }
    awayTeam {
      ...TeamFragment
    }
    awayStats {
      category
      value
      result
    }
    awayLineup {
      pointsBreakdown {
        category
        value
      }
    }
  }
`);

export const rankQuery = graphql(`
  query getBoxScores($year: Int, $matchupPeriodOffset: Int) {
    getBoxScores(year: $year, matchupPeriodOffset: $matchupPeriodOffset) {
      __typename
      success
      errors {
        code
        message
      }
      boxScores {
        ...BoxScoreFragment
      }
      currentMatchupPeriod
    }
  }
`);
