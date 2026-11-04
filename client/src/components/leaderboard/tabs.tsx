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
 * league is plain unlinked text (marked by the basketball-strip background);
 * the rest are regular links.
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
        className={classNames(
          styles.leagueRow,
          "flex flex-wrap gap-x-4 gap-y-1"
        )}
      >
        {leagues.map((league) => {
          const active = league.index === leagueIndex;
          return active ? (
            <span
              key={league.index}
              id={`league-tab-${league.index}`}
              role="tab"
              aria-selected
              aria-current="page"
              className={styles.activeLeagueTab}
            >
              {league.name}
            </span>
          ) : (
            <Link
              key={league.index}
              id={`league-tab-${league.index}`}
              href={`/${leagueSlug(league.index)}`}
              role="tab"
              aria-selected={false}
            >
              {league.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
