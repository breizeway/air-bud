"use client";

import Link from "next/link";
import { leagueSlug } from "./league-slug";

interface LeagueTab {
  index: number;
  name: string;
}

/**
 * League tabs — a flex-wrap row of standard site links (semantic ARIA
 * tablist). The active league is plain unlinked text; the rest are regular
 * links. No custom styling, so it wraps like any other text.
 */
export default function LeagueTabs({
  leagues,
  leagueIndex,
}: {
  leagues: LeagueTab[];
  leagueIndex: number;
}) {
  return (
    <div
      role="tablist"
      aria-label="Leagues"
      className="flex flex-wrap gap-x-3 gap-y-1"
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
  );
}
