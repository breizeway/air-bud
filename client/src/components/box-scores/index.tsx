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
import styles from "./box-scores.module.css";

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
  }),
  columnHelper.accessor(BoxStatCategories.PF, {
    header: "PF",
    cell: (info) => <span>{info.getValue().value}</span>,
    sortingFn,
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
  const [matchupPeriodOffset, _setMatchupPeriodOffset] = useState<number>(0);
  const [results] = useQuery({
    query: rankQuery,
    variables: {
      matchupPeriodOffset,
    },
  });
  const currentMatchupPeriod = results.data?.getBoxScores.currentMatchupPeriod;
  const setMatchupPeriodOffset = (offset: number) => {
    if (offset <= 0 && (currentMatchupPeriod ?? 0) + offset > 0)
      _setMatchupPeriodOffset(offset);
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [showMore, setShowMore] = useState<boolean>(false);
  const ShowMoreButton = () => (
    <button className="font-bold" onClick={() => setShowMore(!showMore)}>
      Show {showMore ? "less" : "more"}
    </button>
  );

  const tableRef = useRef<HTMLTableElement>(null);
  const tableWidth = tableRef.current?.getBoundingClientRect().width;

  const boxRanks = useMemo(
    () =>
      Object.values(
        getRankedBoxScores(results.data?.getBoxScores.boxScores) ??
          defaultBoxRanks
      ).sort((a, b) => (a.ALL.rank ?? 0) - (b.ALL.rank ?? 0)),
    [results]
  );

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

  const queryFetching = results.fetching;
  const queryIsSuccess = !!results.data?.getBoxScores.boxScores;
  const queryFetchingInitialData = queryFetching && !queryIsSuccess;

  return (
    <div className="w-fit max-w-full">
      <div className="flex flex-wrap gap-1 mb-2 justify-between items-baseline font-semibold">
        <div className="flex gap-2">
          <span className="text-2xl">Box Score Rankings</span>
          <Loading isLoading={!!results.data && results.fetching} />
        </div>
        {currentMatchupPeriod && (
          <div className="flex gap-2 items-center">
            <button
              className="button"
              onClick={() => setMatchupPeriodOffset(matchupPeriodOffset - 1)}
            >
              &#9668;
            </button>
            <div className="flex flex-col justify-center items-center">
              <span
                className={classNames({ "mt-[-0.25em]": !matchupPeriodOffset })}
              >
                Week {currentMatchupPeriod + matchupPeriodOffset}
              </span>
              {!matchupPeriodOffset && (
                <span className="text-xs mt-[-0.5em] font-normal">
                  (current)
                </span>
              )}
            </div>
            <button
              className="button"
              onClick={() => setMatchupPeriodOffset(matchupPeriodOffset + 1)}
            >
              &#9658;
            </button>
          </div>
        )}
      </div>

      <div
        className={classNames(
          "paint font-mono text-sm w-fit max-w-full overflow-x-scroll",
          styles.tableContainer
        )}
      >
        <Loading
          isLoading={queryFetchingInitialData}
          message="Loading"
          className="my-2 mx-4"
        />

        {!queryFetchingInitialData && !queryIsSuccess && (
          <div className="py-2 px-4">
            {"Sorry, there was an error fetching box scores :("}
          </div>
        )}

        {queryIsSuccess && (
          <table ref={tableRef}>
            <thead className="text-left">
              {table.getHeaderGroups().map((headerGroup) => (
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
              {table.getRowModel().rows.map((row) => (
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
        )}
      </div>

      {queryIsSuccess && (
        <div
          style={
            tableWidth ? { maxWidth: (tableWidth / 16).toFixed(0) + "rem" } : {}
          }
          className="text-xs p-2"
        >
          <p>
            {showMore ? (
              <span>
                * The <code>ALL</code>, or &quot;Overall&quot; category
                indicates a team&apos;s performance across all categories
                relative to other teams in the league. It&apos;s calculated by
                assigning a score from 0-10 to each of the nine categories. If
                the team ranks first in that category, a score of{" "}
                <code>10</code> is given; if 2nd, <code>9</code>; and so on,
                ending with <code>1</code> for 10th place (or 0 if there is no
                value). Those scores are then tallied up to make the overall
                score for the week.{" "}
              </span>
            ) : (
              <span>
                * The <code>ALL</code>, or &quot;Overall&quot; category
                indicates...{" "}
              </span>
            )}
            <ShowMoreButton />
          </p>
        </div>
      )}
    </div>
  );
}
