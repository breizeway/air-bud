"use client";

import { useQuery } from "@urql/next";
import Loading from "../loading";
import { useMemo, useRef, useState } from "react";
import {
  BoxStatCategories,
  RankedBoxScore,
  RankedBoxScores,
  getRankedBoxScores,
} from "./utils";
import { rankQuery } from "@/components/box-scores/queries";
import {
  SortingFn,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { classNames } from "@/utils";

declare module "@tanstack/table-core" {
  interface SortingFns {
    byRank: SortingFn<unknown>;
  }
}

const columnHelper = createColumnHelper<RankedBoxScore>();
const sortingFn = "byRank";
const columns = [
  columnHelper.accessor("teamName", {
    header: "Team",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor(BoxStatCategories["FG%"], {
    header: "FG%",
    cell: (info) => (
      <span>
        {info
          .getValue()
          .value.toFixed(3)
          .slice(info.getValue().value < 1 ? 1 : 0)}
      </span>
    ),
    sortingFn,
  }),
  columnHelper.accessor(BoxStatCategories["3PTM"], {
    header: "3PM",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
  }),
  columnHelper.accessor(BoxStatCategories.REB, {
    header: "REB",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
  }),
  columnHelper.accessor(BoxStatCategories.AST, {
    header: "AST",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
  }),
  columnHelper.accessor(BoxStatCategories.STL, {
    header: "STL",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
  }),
  columnHelper.accessor(BoxStatCategories.BLK, {
    header: "BLK",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
  }),
  columnHelper.accessor(BoxStatCategories.TO, {
    header: "TO",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
    sortDescFirst: true,
  }),
  columnHelper.accessor(BoxStatCategories.PF, {
    header: "PF",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
    sortDescFirst: true,
  }),
  columnHelper.accessor(BoxStatCategories.PTS, {
    header: "PTS",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
  }),
  columnHelper.accessor(BoxStatCategories.ALL, {
    header: () => (
      <span>
        ALL<sup className="text-xs">*</sup>
      </span>
    ),
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
  }),
];

const defaultBoxRanks: RankedBoxScores = {};
const getCellClasses = (idx: number, length: number) =>
  classNames("p-2", {
    "text-right": !!idx,
    "sticky left-0 z-10 bg-black pl-4": !idx,
    "pr-4": idx === length - 1,
  });

export default function BoxScores() {
  const [matchupPeriodOffset, setMatchupPeriodOffset] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showMore, setShowMore] = useState<boolean>(false);
  const ShowMoreButton = () => (
    <button className="font-bold" onClick={() => setShowMore(!showMore)}>
      Show {showMore ? "less" : "more"}
    </button>
  );

  const tableRef = useRef<HTMLTableElement>(null);
  const maxWidth = tableRef.current?.getBoundingClientRect().width;

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
  console.log(`:::BOXRANKS::: `, boxRanks);

  const table = useReactTable({
    columns,
    data: boxRanks,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    sortingFns: {
      byRank: (rowA: any, rowB: any, columnId: any): number =>
        rowA.getValue(columnId).rank < rowB.getValue(columnId).rank ? 1 : -1,
    },
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
            className="button"
            onClick={() => setMatchupPeriodOffset(matchupPeriodOffset - 1)}
          >
            &#9668;
          </button>
          <button
            className="button"
            onClick={() =>
              setMatchupPeriodOffset(
                matchupPeriodOffset
                  ? matchupPeriodOffset + 1
                  : matchupPeriodOffset
              )
            }
          >
            &#9658;
          </button>
        </div>
      </div>
      <div className="paint font-mono overflow-x-scroll w-fit max-w-full">
        {results.fetching && !results.data ? (
          <Loading isLoading={results.fetching} className="my-2 mx-4" />
        ) : !results.data?.getBoxScores?.success ? (
          <span>{"Sorry, there was an error fetching box scores :("}</span>
        ) : (
          <>
            <table ref={tableRef}>
              <thead className="text-left">
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup.id} className="pt-10">
                    {headerGroup.headers.map((header, idx, arr) => (
                      <th
                        key={header.id}
                        className={getCellClasses(idx, arr.length)}
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
                    {row.getVisibleCells().map((cell, idx, arr) => (
                      <td
                        key={cell.id}
                        className={getCellClasses(idx, arr.length)}
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
          </>
        )}
      </div>
      {!!results.data?.getBoxScores?.success && (
        <div style={{ maxWidth: maxWidth?.toFixed(0) + "px" }}>
          <p className="text-xs mt-1 ml-2">
            {showMore && maxWidth ? (
              <span>
                * The <code>ALL</code>, or "Overall" category indicates how a
                team is performing across <em>all</em> categories as compared to
                the other teams in the league. It's calculated by assigning a
                score of 0-10 for each category based on how that category ranks
                across the league. If the team ranks first in that category, a
                score of <code>10</code> is given; if 2nd, <code>9</code>; and
                so on, ending with <code>1</code> for 10th place (and/or 0 if
                there is no value). Those scores then tallied up to make the
                overall score for the week.{" "}
              </span>
            ) : (
              <span>
                * The <code>ALL</code>, or "Overall" category indicates...{" "}
              </span>
            )}
            <ShowMoreButton />
          </p>
        </div>
      )}
    </div>
  );
}
