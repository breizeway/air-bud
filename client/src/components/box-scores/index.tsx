"use client";

import { graphql } from "@/gql";
import { useQuery } from "@urql/next";

export default function BoxScores() {
  const [result, reexecute] = useQuery({
    query: graphql(`
      query getBoxScores {
        getBoxScores {
          __typename
          success
          errors {
            code
            message
          }
          boxScores {
            winner
            homeTeam {
              teamName
            }
            homeStats {
              category
              value
              result
            }
            awayTeam {
              teamName
            }
            awayStats {
              category
              value
              result
            }
          }
        }
      }
    `),
  });
  const { data } = result;
  console.log(`:::DATA.GETBOXSCORES::: `, data?.getBoxScores);
  return <></>;
}
