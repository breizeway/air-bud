import { graphql } from "../../gql";

export const RankQueryBoxScore = graphql(`
  fragment RankQueryBoxScore on BoxScore {
    winner
    homeTeam {
      teamName
      standing
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
      teamName
      standing
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
        ...RankQueryBoxScore
      }
      currentMatchupPeriod
    }
  }
`);
