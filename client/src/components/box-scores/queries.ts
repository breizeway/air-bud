import { graphql } from "../../gql";

export const RankQueryBoxScore = graphql(`
  fragment RankQueryBoxScore on BoxScore {
    winner
    homeTeam {
      teamName
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
  query getBoxScores {
    getBoxScores {
      __typename
      success
      errors {
        code
        message
      }
      boxScores {
        ...RankQueryBoxScore
      }
    }
  }
`);
