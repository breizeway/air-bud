"use client";

import { graphql } from "@/gql";
import { useQuery } from "@urql/next";
import Loading from "../loading";

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
  return (
    <div className=" flex justify-center items-center border-2 border-black p-4">
      {result.fetching ? (
        <Loading isLoading={result.fetching} />
      ) : (
        JSON.stringify(data)
      )}
    </div>
  );
}
