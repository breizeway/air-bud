"use client";

import { useQuery } from "@urql/next";
import Loading from "../loading";
import { useMemo, useState } from "react";
import { RankedBoxScore, RankedBoxScores, getRankedBoxScores } from "./utils";
import { rankQuery } from "@/components/box-scores/queries";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
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
    invertSorting: true,
  }),
  columnHelper.accessor("PF.value", {
    header: "PF",
    cell: (info) => info.getValue(),
    invertSorting: true,
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
const stickyColumnClasses = " sticky left-0 z-10 paint border-0";

export default function BoxScores() {
  const [matchupPeriodOffset, setMatchupPeriodOffset] = useState(0);
  const [results] = useQuery({
    query: rankQuery,
    variables: { matchupPeriodOffset },
  });
  const boxRanks = useMemo(
    () =>
      Object.values(
        getRankedBoxScores(results.data?.getBoxScores.boxScores) ??
          defaultBoxRanks
      ).sort((a, b) => (a.ALL.rank ?? 0) - (b.ALL.rank ?? 0)),
    [results]
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data: boxRanks,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,

    state: { sorting },
  });
  const headerGroups = useMemo(
    () => table.getHeaderGroups(),
    [table, boxRanks]
  );
  const tableRows = useMemo(
    () => table.getRowModel().rows,
    [table, boxRanks, sorting]
  );

  // TODO: next - 1) fix visible stats on table scroll 2) matchup period scrolling 3) loading states
  return (
    <div className="w-fit max-w-full">
      <div className="flex gap-2 justify-between items-end mb-1">
        <span className="text-2xl font-semibold">Box Score Rankings</span>
        <div className="flex gap-2 mb-1">
          <button
            onClick={() => setMatchupPeriodOffset(matchupPeriodOffset - 1)}
          >
            {"<"}
          </button>
          <button
            onClick={() =>
              setMatchupPeriodOffset(
                matchupPeriodOffset
                  ? matchupPeriodOffset + 1
                  : matchupPeriodOffset
              )
            }
          >
            {">"}
          </button>
        </div>
      </div>
      <div className="paint font-mono px-2 py-1 overflow-x-scroll max-w-full">
        {results.fetching && !results.data ? (
          <Loading isLoading={results.fetching} />
        ) : !results.data?.getBoxScores?.success ? (
          <span>{"Sorry, there was an error fetching box scores :("}</span>
        ) : (
          <table>
            <thead className="text-left">
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => (
                    <th
                      key={header.id}
                      className={`p-1${
                        !idx ? stickyColumnClasses : " text-right"
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <span className="ml-1">{"▴"}</span>,
                            desc: <span className="ml-1">{"▾"}</span>,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="">
              {tableRows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, idx) => (
                    <td
                      key={cell.id}
                      className={`p-1${
                        !idx ? stickyColumnClasses : " text-right"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
