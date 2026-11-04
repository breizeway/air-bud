"use client";

import { classNames } from "@/utils";
import Link from "next/link";
import { leagueSlug } from "./league-slug";
import styles from "./leaderboard.module.css";

interface LeagueTab {
  index: number;
  name: string;
}

/**
 * League tabs — a flex-wrap row of plain links (semantic ARIA tablist), with
 * a "League" label above matching the table's own header style. The active
 * league is a link too, just like the others, marked by the repeating
 * basketball-strip background instead of opacity.
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
        className={classNames(styles.leagueRow, "flex flex-wrap gap-x-4")}
      >
        {leagues.map((league) => {
          const active = league.index === leagueIndex;
          return (
            <Link
              key={league.index}
              id={`league-tab-${league.index}`}
              href={`/${leagueSlug(league.index)}`}
              role="tab"
              aria-selected={active}
              aria-current={active ? "page" : undefined}
              className={classNames({ [styles.activeLeagueTab]: active })}
            >
              {league.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
