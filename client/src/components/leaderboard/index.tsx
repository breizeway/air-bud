"use client";

import { UrqlSubscription } from "@/app/_providers/urql-wrapper";
import {
  leaderboardQuery,
  leaguesQuery,
} from "@/components/leaderboard/queries";
import { LiveIndicator } from "@/components/live-indicator";
import { ClassNames, classNames } from "@/utils";
import useClient from "@/utils/use-client";
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
import { useQuery } from "@urql/next";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Loading from "../loading";
import Popover from "../popover";
import ScalingImage from "../scaling-image";
import styles from "./leaderboard.module.css";
import LeagueTabs from "./tabs";
import { getTeamName } from "./utils";

declare module "@tanstack/table-core" {
  interface SortingFns {
    byRank: SortingFn<unknown>;
    byTeamName: SortingFn<unknown>;
  }
}

export interface LeaderboardOptions {
  sfwMode: boolean;
  sfwModeLocked: boolean;
}
const defaultLeaderboardOptions = {
  sfwMode: false,
  sfwModeLocked: false,
};

// One already-computed table cell as it arrives from the backend.
type Cell = { category: string; display: string; rank: number; score: number };
// A row shaped for the table: display name + cells keyed by category.
type TableRow = {
  teamName: string;
  standing: number;
  byCat: { [category: string]: Cell };
};

const columnHelper = createColumnHelper<TableRow>();
const ALL = "ALL";

// Persisted at module scope so the selected week survives switching league tabs
// (each tab is a link, so the component may remount) — kept deliberately simple.
let persistedMatchupPeriodOffset = 0;

export default function Leaderboard({ leagueIndex }: { leagueIndex: number }) {
  const { window } = useClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [leaguesResult] = useQuery({ query: leaguesQuery });
  const leagues = leaguesResult.data?.getLeagues?.leagues ?? [];

  const [matchupPeriodOffset, _setMatchupPeriodOffset] = useState<number>(
    persistedMatchupPeriodOffset
  );
  const [results, refetch] = useQuery({
    query: leaderboardQuery,
    variables: { leagueIndex, matchupPeriodOffset },
  });
  const leaderboard = results.data?.getLeaderboard?.leaderboard;
  const queryFetching = results.fetching;
  const queryIsSuccess = !!leaderboard;
  const queryFetchingInitialData = queryFetching && !queryIsSuccess;

  const currentMatchupPeriod = leaderboard?.currentMatchupPeriod;
  const matchupPeriod = leaderboard?.matchupPeriod;
  const setMatchupPeriodOffset = (offset: number) => {
    if (offset <= 0 && (currentMatchupPeriod ?? 0) + offset > 0) {
      persistedMatchupPeriodOffset = offset;
      _setMatchupPeriodOffset(offset);
    }
  };
  const isCurrentWeek = matchupPeriodOffset === 0;
  const isLive = !!leaderboard?.isLive;

  const manualRefetchInFlight = useRef(false);
  const manualRefetch = async () => {
    manualRefetchInFlight.current = true;
    refetch();
  };
  useEffect(() => {
    if (!results.stale) manualRefetchInFlight.current = false;
  }, [results]);

  // Poll for live scores while a game is in progress (server decides).
  useEffect(() => {
    const sub = new UrqlSubscription("leaderboard", refetch);
    if (isLive) sub.start();
    return () => sub.stop();
  }, [refetch, isLive]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [showMore, setShowMore] = useState<boolean>(false);

  const optionsLsKey = "leaderboardOptions";
  const [options, _setOptions] = useState<LeaderboardOptions>(
    defaultLeaderboardOptions
  );
  const setOptions = useCallback(
    (newOptions: LeaderboardOptions) => {
      if (window) {
        _setOptions(newOptions);
        window.localStorage.setItem(optionsLsKey, JSON.stringify(newOptions));
      }
    },
    [window]
  );
  useEffect(() => {
    if (window) {
      const localStorage = window.localStorage;
      const sfwModeParam = searchParams.get("sfw-mode");
      const sfwMode = sfwModeParam === "true";

      const optionsFromStorage =
        localStorage?.getItem("leaderboardOptions") ?? "{}";
      const initialOptions = {
        ...defaultLeaderboardOptions,
        ...JSON.parse(optionsFromStorage),
      };
      if (sfwMode) {
        // set only if safe mode is true (sets as default)
        Object.assign(initialOptions, { sfwMode, sfwModeLocked: sfwMode });
      }
      const search = new URLSearchParams(window.location.search);
      search.delete("sfw-mode");
      router.replace(
        window.location.href.split("?").at(0) + "/?" + search.toString()
      );
      setOptions(initialOptions);
    }
  }, [window]);
  const registerOption = (
    name: keyof LeaderboardOptions,
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

  // The backend returns the category list (ordered, ALL last) and pre-ranked
  // rows; shape them for the table and sort by the overall (ALL) rank.
  const categories = leaderboard?.categories ?? [];
  const rows: TableRow[] = useMemo(() => {
    if (!leaderboard) return [];
    return leaderboard.rows
      .map((row) => ({
        teamName: getTeamName(row.teamName, row.owners, options.sfwMode),
        standing: row.standing,
        byCat: Object.fromEntries(row.cells.map((c) => [c.category, c])),
      }))
      .sort((a, b) => (a.byCat[ALL]?.rank ?? 0) - (b.byCat[ALL]?.rank ?? 0));
  }, [leaderboard, options.sfwMode]);

  const columns = useMemo(() => {
    const cols: any[] = [
      columnHelper.accessor(
        (row) => ({
          teamName: row.teamName,
          rank: row.byCat[ALL]?.rank ?? 0,
          standing: row.standing,
        }),
        {
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
            const { teamName, rank, standing } = info.getValue();
            const rankChange = standing - rank;
            const rankColors = {
              "text-green-500": rankChange > 0,
              "text-red-500": rankChange < 0,
              "text-yellow-500": rankChange === 0,
              "opacity-90": true,
            };
            return (
              <Cell
                primary={<span>{teamName}</span>}
                secondary={
                  <span className="whitespace-nowrap">
                    <Rank rank={rank} className={rankColors} fullOpacity />{" "}
                    <span className={classNames(rankColors)}>
                      <ChangeSymbol change={rankChange} />
                      {Math.abs(rankChange)}
                    </span>
                  </span>
                }
              />
            );
          },
          sortingFn: "byTeamName",
        }
      ),
    ];

    categories.forEach((category) => {
      const name = category.name;
      cols.push(
        columnHelper.accessor((row) => row.byCat[name], {
          id: name,
          header: (info) => (
            <Cell
              primary={
                <span>
                  {name}
                  {name === ALL && <sup className="text-xs">*</sup>}
                  {<SortSymbol {...{ info }} />}
                </span>
              }
            />
          ),
          cell: (info) => (
            <Cell
              primary={<span>{info.getValue()?.display ?? ""}</span>}
              secondary={<Rank rank={info.getValue()?.rank} />}
            />
          ),
          sortingFn: "byRank",
        })
      );
    });

    return cols;
  }, [categories]);

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    sortingFns: {
      byRank: (rowA: any, rowB: any, columnId: any): number =>
        (rowA.getValue(columnId)?.rank ?? 0) <
        (rowB.getValue(columnId)?.rank ?? 0)
          ? 1
          : -1,
      byTeamName: (rowA: any, rowB: any, columnId: any): number =>
        rowA.getValue(columnId)?.teamName < rowB.getValue(columnId)?.teamName
          ? 1
          : -1,
    },
  });

  return (
    <div className={classNames(styles.leaderboard, "w-full")}>
      <div className={classNames(styles.toolbar, "font-semibold")}>
        <div className="flex items-center shrink-0">
          <button
            className="text-xl"
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
                Week{" "}
                {matchupPeriod !== null && matchupPeriod !== undefined
                  ? matchupPeriod
                  : "--"}
              </div>
              {isCurrentWeek && (
                <span className="text-xs mt-[-0.5em] font-normal">
                  (current)
                </span>
              )}
            </button>
            <button
              className="text-xl"
              onClick={() => setMatchupPeriodOffset(matchupPeriodOffset + 1)}
            >
              &#9658;
            </button>
        </div>

        {leagues.length > 1 && (
          <LeagueTabs leagues={leagues} leagueIndex={leagueIndex} />
        )}

        <div className="flex items-center shrink-0 ml-auto">
            <LiveIndicator
              isLive={!queryFetchingInitialData && isCurrentWeek && isLive}
              className="text-xl mr-[0.9rem] mt-[0.15rem]"
            />
            <RefetchButton
              isFetching={
                !!results.data &&
                (results.fetching ||
                  (results.stale && manualRefetchInFlight.current))
              }
              refetch={manualRefetch}
            />
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
                    className="inline text-xl mb-[0.1em] my-auto"
                  />
                </button>
              )}
              content={({ isOpen }) => (
                <>
                  {isOpen && (
                    <div className="p-3 text-lg bg-beige-100 flex flex-col shadow-xl">
                      <table className="[&_input]:mr-4">
                        <tbody>
                          {!options.sfwModeLocked && (
                            <tr>
                              <td>
                                <div className="grid place-items-center">
                                  <input
                                    id="options__sfw-mode"
                                    type="checkbox"
                                    className="inline my-auto"
                                    {...registerOption("sfwMode", "checkbox")}
                                  />
                                </div>
                              </td>
                              <td>
                                <label
                                  htmlFor="options__sfw-mode"
                                  className="whitespace-nowrap"
                                >
                                  SFW Mode
                                </label>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            />
          </div>
      </div>

      <div
        role="tabpanel"
        aria-labelledby={`league-tab-${leagueIndex}`}
        className={classNames(
          "paint font-mono text-sm w-full overflow-x-scroll",
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
          <table ref={tableRef} className={styles.leaderboardTable}>
            <thead className="text-left">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="pt-10">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={classNames(styles.cell)}>
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
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={classNames(styles.cell)}>
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
                assigning a score from 0-10 to each scored category, and then
                adding them up. If a team ranks first in a category, a score of{" "}
                <code>10</code> is given; if 2nd, <code>9</code>; and so on,
                ending with <code>1</code> for 10th place (or <code>0</code> if
                there is no value yet).{" "}
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
  const className = "inline text-xl mb-[0.1em] items-center";

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
};
const Cell = ({ primary, secondary }: CellProps) => {
  return (
    <div className="flex flex-col justify-start py-[0.08rem]">
      <div>{primary}</div>
      <div className="text-xs mt-[-0.25em]">{secondary}</div>
    </div>
  );
};

const SortSymbol = ({ info }: { info: HeaderContext<TableRow, any> }) =>
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

const Rank = ({
  rank,
  className,
  fullOpacity = false,
}: {
  rank?: number;
  className?: ClassNames;
  fullOpacity?: boolean;
}) => (
  <span className={classNames(className, { "opacity-50": !fullOpacity })}>
    {rank
      ? `${rank}${
          rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th"
        }`
      : null}
  </span>
);
