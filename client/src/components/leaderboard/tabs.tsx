"use client";

import { classNames } from "@/utils";
import Link from "next/link";
import { Fragment } from "react";
import { leagueSlug } from "./league-slug";
import styles from "./leaderboard.module.css";

interface LeagueTab {
  index: number;
  name: string;
}

/**
 * League tabs — a flex-wrap row of plain, pipe-separated links (semantic
 * ARIA tablist), with a "League" label above matching the table's own header
 * style. The active league is a link too, just like the others, marked by
 * the repeating basketball-strip background instead of opacity.
 */
export default function LeagueTabs({
  leagues,
  leagueIndex,
}: {
  leagues: LeagueTab[];
  leagueIndex: number;
}) {
  return (
    <div>
      <div className={styles.leagueHeader}>League</div>
      <div
        role="tablist"
        aria-label="Leagues"
        className={classNames(styles.leagueRow, "flex flex-wrap gap-x-2")}
      >
        {leagues.map((league, i) => {
          const active = league.index === leagueIndex;
          return (
            <Fragment key={league.index}>
              {i > 0 && <span aria-hidden>{"|"}</span>}
              <Link
                id={`league-tab-${league.index}`}
                href={`/${leagueSlug(league.index)}`}
                role="tab"
                aria-selected={active}
                aria-current={active ? "page" : undefined}
                className={classNames({ [styles.activeLeagueTab]: active })}
              >
                {league.name}
              </Link>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
