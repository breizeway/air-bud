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
 * League tabs — a plain, pipe-separated nav row (semantic ARIA tablist). The
 * active league renders bracketed and unlinked, `[ Like This ]`; others are
 * plain underlined links. It's just inline text, so it wraps on narrow
 * screens with no layout logic of its own.
 */
export default function LeagueTabs({
  leagues,
  leagueIndex,
}: {
  leagues: LeagueTab[];
  leagueIndex: number;
}) {
  return (
    <div role="tablist" aria-label="Leagues" className={styles.leagueTabs}>
      {leagues.map((league, i) => {
        const active = league.index === leagueIndex;
        return (
          <span key={league.index} className={styles.leagueTabItem}>
            {i > 0 && (
              <span aria-hidden className={styles.leagueTabSep}>
                {" | "}
              </span>
            )}
            {active ? (
              <>
                <span aria-hidden className={styles.leagueTabBracket}>
                  {"[ "}
                </span>
                <span
                  id={`league-tab-${league.index}`}
                  role="tab"
                  aria-selected
                  aria-current="page"
                  className={classNames(styles.leagueTabLabel, "font-bold")}
                >
                  {league.name}
                </span>
                <span aria-hidden className={styles.leagueTabBracket}>
                  {" ]"}
                </span>
              </>
            ) : (
              <Link
                id={`league-tab-${league.index}`}
                href={`/${leagueSlug(league.index)}`}
                role="tab"
                aria-selected={false}
                className={classNames(styles.leagueTabLabel, "underline")}
              >
                {league.name}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
