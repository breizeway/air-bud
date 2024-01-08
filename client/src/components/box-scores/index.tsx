"use client";

import { useQuery } from "@urql/next";
import Loading from "../loading";
import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BoxStatCategories,
  RankedBoxScore,
  RankedBoxScores,
  TeamStat,
  getRankedBoxScores,
} from "./utils";
import { rankQuery } from "@/components/box-scores/queries";
import {
  HeaderContext,
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
import ScalingImage from "../scaling-image";
import Popover from "../popover";
import useClient from "@/utils/use-client";

declare module "@tanstack/table-core" {
  interface SortingFns {
    byRank: SortingFn<unknown>;
    byTeamName: SortingFn<unknown>;
  }
}

interface TableOptions {
  showDetail: boolean;
}
const formatRank = (rank: number | undefined) =>
  rank
    ? `${rank}${
        rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th"
      }`
    : null;
const columnHelper = createColumnHelper<RankedBoxScore>();
const sortingFn = "byRank";
const defaultBoxRanks: RankedBoxScores = {};
const getCellClasses = (idx: number, length: number) =>
  classNames("px-2", {
    "text-right": !!idx,
    "sticky left-0 z-10 bg-black pl-4": !idx,
    "pr-4": idx === length - 1,
  });

export default function BoxScores() {
  const { window } = useClient();
  const localStorage = window?.localStorage;
  const [matchupPeriodOffset, _setMatchupPeriodOffset] = useState<number>(0);
  const [results, _refetch] = useQuery({
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
  const manualRefetchInFlight = useRef(false);
  const refetch = async () => {
    manualRefetchInFlight.current = true;
    _refetch();
  };
  useEffect(() => {
    if (!results.stale) manualRefetchInFlight.current = false;
  }, [results]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [showMore, setShowMore] = useState<boolean>(false);

  const optionsLsKey = "boxScoreRankingsOptions";
  const [options, _setOptions] = useState<TableOptions>({
    showDetail: false,
  });
  useEffect(() => {
    const optionsFromStorage = localStorage?.getItem("boxScoreRankingsOptions");
    if (optionsFromStorage) {
      _setOptions(JSON.parse(optionsFromStorage));
    }
  }, [localStorage]);
  const setOptions = (options: TableOptions) => {
    _setOptions(options);
    localStorage?.setItem(optionsLsKey, JSON.stringify(options));
  };
  const registerOption = (
    name: keyof TableOptions,
    inputType: HTMLInputTypeAttribute | undefined = undefined
  ) => ({
    name,
    [inputType === "checkbox" ? "checked" : "value"]: options[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const newOptions = {
        ...options,
      };
      if (inputType === "checkbox") {
        Object.assign(newOptions, { [name]: event.target.checked });
      } else {
        Object.assign(newOptions, { [name]: event.target.value });
      }
      setOptions(newOptions);
    },
  });

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

  const columns = useMemo(() => {
    return [
      columnHelper.accessor(BoxStatCategories["ALL"], {
        id: "teamName",
        header: (info) => (
          <Cell
            primary={
              <span>
                {"Team"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => {
          const rank = info.getValue().rank ?? 0;
          const rankChange = info.getValue().standing - rank;

          return (
            <Cell
              primary={<span>{info.getValue().teamName}</span>}
              secondary={
                <span>
                  <Rank rank={rank} />{" "}
                  <span
                    className={classNames({
                      "text-green-500": rankChange > 0,
                      "text-red-500": rankChange < 0,
                      "text-yellow-500": rankChange === 0,
                    })}
                  >
                    <ChangeSymbol change={rankChange} />
                    {Math.abs(rankChange)}
                  </span>
                </span>
              }
              showDetail={options.showDetail}
            />
          );
        },
        sortingFn: "byTeamName",
      }),
      columnHelper.accessor(BoxStatCategories["FG%"], {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"FG%"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={
              <span>
                {info
                  .getValue()
                  .value.toFixed(3)
                  .slice(info.getValue().value < 1 ? 1 : 0)}
              </span>
            }
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories["3PTM"], {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"3PM"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories.REB, {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"REB"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories.AST, {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"AST"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories.STL, {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"STL"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories.BLK, {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"BLK"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories.TO, {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"TO"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories.PF, {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"PF"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories.PTS, {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"PTS"}
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
      columnHelper.accessor(BoxStatCategories.ALL, {
        header: (info) => (
          <Cell
            primary={
              <span>
                {"ALL"}
                <sup className="text-xs">*</sup>
                {<SortSymbol {...{ info }} />}
              </span>
            }
          />
        ),
        cell: (info) => (
          <Cell
            primary={<span>{info.getValue().value}</span>}
            secondary={<Rank rank={info.getValue().rank} />}
            showDetail={options.showDetail}
          />
        ),
        sortingFn,
      }),
    ];
  }, [options.showDetail]);

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
      byTeamName: (rowA: any, rowB: any, columnId: any): number =>
        rowA.getValue(columnId).teamName < rowB.getValue(columnId).teamName
          ? 1
          : -1,
    },
  });

  const queryFetching = results.fetching;
  const queryIsSuccess = !!results.data?.getBoxScores.boxScores;
  const queryFetchingInitialData = queryFetching && !queryIsSuccess;

  return (
    <div className="w-fit max-w-full">
      <div className="flex flex-wrap gap-2 mb-2 items-center font-semibold">
        <span className="text-2xl ml-2">Box Score Rankings</span>

        {currentMatchupPeriod && (
          <div className="flex flex-wrap gap-2 grow justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setMatchupPeriodOffset(matchupPeriodOffset - 1)}
              >
                &#9668;
              </button>
              <button
                className="flex flex-col justify-center items-center min-w-[4.5rem] border-0 p-0"
                onClick={() => setMatchupPeriodOffset(0)}
              >
                <div
                  className={classNames({
                    "mt-[-0.25em]": !matchupPeriodOffset,
                  })}
                >
                  Week {currentMatchupPeriod + matchupPeriodOffset}
                </div>
                {!matchupPeriodOffset && (
                  <span className="text-xs mt-[-0.5em] font-normal">
                    (current)
                  </span>
                )}
              </button>
              <button
                onClick={() => setMatchupPeriodOffset(matchupPeriodOffset + 1)}
              >
                &#9658;
              </button>
            </div>
            <div className="flex items-center">
              <Popover
                button={({ setIsOpen }) => (
                  <button
                    className="border-[0.25rem] border-transparent"
                    onClick={() => setIsOpen(true)}
                  >
                    <ScalingImage
                      alt="three vertical dots"
                      src="/icons/three-dots-vertical.svg"
                      hEm={1}
                      wEm={1}
                      className="inline text-lg mb-[0.1em] my-auto"
                    />
                  </button>
                )}
                content={({ isOpen }) => (
                  <>
                    {isOpen && (
                      <div className="px-4 py-1 text-lg bg-beige-100 flex flex-col shadow-xl">
                        <div className="flex gap-2 py-1">
                          <input
                            id="options__show-detail"
                            type="checkbox"
                            className="inline"
                            {...registerOption("showDetail", "checkbox")}
                          />
                          <label
                            htmlFor="options__show-detail"
                            className="whitespace-nowrap"
                          >
                            Show detail
                          </label>
                        </div>
                      </div>
                    )}
                  </>
                )}
              />
              <RefetchButton
                isFetching={
                  !!results.data &&
                  (results.fetching ||
                    (results.stale && manualRefetchInFlight.current))
                }
                refetch={refetch}
              />
            </div>
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
            Sorry, there was an error fetching box scores{" "}
            <ScalingImage
              src="/skull.gif"
              alt="green rotating skull and crossbones"
              wEm={2}
              hEm={1.6}
              className="inline"
            />
          </div>
        )}

        {queryIsSuccess && (
          <table ref={tableRef} className="my-2">
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
          style={tableWidth ? { maxWidth: tableWidth / 16 + "rem" } : {}}
          className="text-xs p-2"
        >
          <p>
            {showMore ? (
              <span>
                * The <code>ALL</code>, or &quot;Overall&quot; category
                indicates a team&apos;s performance across all categories
                relative to other teams in the league. It&apos;s calculated by
                assigning a score from 0-10 to each of the nine categories. If a
                team ranks first in that category, a score of <code>10</code> is
                given; if 2nd, <code>9</code>; and so on, ending with{" "}
                <code>1</code> for 10th place (or 0 if there is no value). Those
                scores are then tallied up to make the overall score for the
                week.{" "}
              </span>
            ) : (
              <span>
                * The <code>ALL</code>, or &quot;Overall&quot; category
                indicates...{" "}
              </span>
            )}
            <button
              className="font-bold border-0"
              onClick={() => setShowMore(!showMore)}
            >
              Show {showMore ? "less" : "more"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

const RefetchButton = ({
  isFetching,
  refetch,
}: {
  isFetching: boolean;
  refetch: MouseEventHandler<HTMLButtonElement>;
}) => {
  const className = "inline text-lg mb-[0.1em] items-center";

  return (
    <button
      onClick={refetch}
      disabled={isFetching}
      className="border-[0.25rem] border-transparent"
    >
      {isFetching ? (
        <Loading isLoading={isFetching} {...{ className }} />
      ) : (
        <ScalingImage
          alt="circular refresh arrow"
          src="/icons/refresh-arrow.svg"
          hEm={1}
          wEm={1}
          {...{ className }}
        />
      )}
    </button>
  );
};

type CellProps = {
  primary: ReactNode;
  secondary?: JSX.Element;
} & Partial<Pick<TableOptions, "showDetail">>;
const Cell = ({ primary, secondary, showDetail }: CellProps) => {
  return (
    <div
      className={classNames("flex flex-col justify-start", {
        "mb-2": !secondary,
      })}
    >
      <div>{primary}</div>
      <div
        className={classNames("text-xs mt-[-0.25em]", {
          invisible: !showDetail,
        })}
      >
        {secondary}
      </div>
    </div>
  );
};

const SortSymbol = ({
  info,
}: {
  info: HeaderContext<RankedBoxScore, TeamStat>;
}) =>
  ({
    asc: <span className="ml-1">{"▴"}</span>,
    desc: <span className="ml-1">{"▾"}</span>,
  }[info.column.getIsSorted() as string] ?? null);

const ChangeSymbol = ({ change }: { change: number }) =>
  ({
    increase: <span className="mr-1">{"▴"}</span>,
    decrease: <span className="mr-1">{"▾"}</span>,
    noChange: <span className="mr-1">{"-"}</span>,
  }[change > 0 ? "increase" : change < 0 ? "decrease" : "noChange"]);

const Rank = ({ rank }: { rank?: number }) => (
  <span className="opacity-50">
    {rank
      ? `${rank}${
          rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th"
        }`
      : null}
  </span>
);
