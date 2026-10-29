import { graphql } from "../../gql";

export const leaguesQuery = graphql(`
  query getLeagues {
    getLeagues {
      success
      errors {
        code
        message
      }
      leagues {
        index
        name
      }
    }
  }
`);

export const leaderboardQuery = graphql(`
  query getLeaderboard(
    $leagueIndex: Int!
    $year: Int
    $matchupPeriodOffset: Int
  ) {
    getLeaderboard(
      leagueIndex: $leagueIndex
      year: $year
      matchupPeriodOffset: $matchupPeriodOffset
    ) {
      success
      errors {
        code
        message
      }
      leaderboard {
        leagueIndex
        leagueName
        currentMatchupPeriod
        matchupPeriod
        isLive
        categories {
          name
          scored
        }
        rows {
          teamName
          standing
          owners {
            firstName
            displayName
          }
          cells {
            category
            display
            rank
            score
          }
        }
      }
    }
  }
`);
