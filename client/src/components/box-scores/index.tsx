"use client";

import { useQuery } from "@urql/next";
import Loading from "../loading";
import { useMemo } from "react";
import { getRankedBoxScores } from "./utils";
import { rankQuery } from "@/components/box-scores/queries";

export default function BoxScores() {
  const [results] = useQuery({
    query: rankQuery,
    variables: { matchupPeriodOffset: 0 },
  });
  const boxRanks = useMemo(
    () => getRankedBoxScores(results.data?.getBoxScores.boxScores),
    [results]
  );
  console.log(`:::BOXRANKS::: `, boxRanks);

  return (
    <div className="flex justify-center items-center border-2 border-black p-4">
      {results.fetching ? (
        <Loading isLoading={results.fetching} />
      ) : !results.data?.getBoxScores?.success ? (
        <span>{"Sorry, there was an error fetching box scores :("}</span>
      ) : (
        JSON.stringify(boxRanks)
      )}
    </div>
  );
}
