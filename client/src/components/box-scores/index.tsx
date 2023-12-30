"use client";

import { useQuery } from "@urql/next";
import Loading from "../loading";
import { useMemo } from "react";
import { RankedBoxScore, RankedBoxScores, getRankedBoxScores } from "./utils";
import { RankQueryBoxScore, rankQuery } from "@/components/box-scores/queries";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel as getCoreRowModelFunction,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<RankedBoxScore>();
const columns = [
  columnHelper.accessor("teamName", {
    header: "Team",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("FG%.value", {
    header: "FG%",
    cell: (info) => info.getValue().toFixed(3).slice(1),
  }),
  columnHelper.accessor("3PTM.value", {
    header: "3PM",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("REB.value", {
    header: "REB",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("AST.value", {
    header: "AST",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("STL.value", {
    header: "STL",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("BLK.value", {
    header: "BLK",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("TO.value", {
    header: "TO",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("PF.value", {
    header: "PF",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("PTS.value", {
    header: "PTS",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("ALL.value", {
    header: "ALL",
    cell: (info) => info.getValue(),
  }),
];

const defaultBoxRanks: RankedBoxScores = {};
const getCoreRowModel = getCoreRowModelFunction();

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

  const table = useReactTable({
    columns,
    data: Object.values(boxRanks ?? defaultBoxRanks),
    getCoreRowModel,
  });
  const headerGroups = useMemo(
    () => table.getHeaderGroups(),
    [table, boxRanks]
  );
  const tableRows = useMemo(() => table.getRowModel().rows, [table, boxRanks]);

  return (
    <div className="flex justify-center items-center border-2 border-black p-3">
      {results.fetching ? (
        <Loading isLoading={results.fetching} />
      ) : !results.data?.getBoxScores?.success ? (
        <span>{"Sorry, there was an error fetching box scores :("}</span>
      ) : (
        <table>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
