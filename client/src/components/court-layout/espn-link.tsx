"use client";

import { leaguesQuery } from "@/components/leaderboard/queries";
import { slugToIndex } from "@/components/leaderboard/league-slug";
import { classNames } from "@/utils";
import { useQuery } from "@urql/next";
import { usePathname } from "next/navigation";
import styles from "./court-layout.module.css";

/**
 * ESPN "FANTASY LEAGUE" logo link. Points at whichever league the table is
 * currently showing — derived from the URL slug (/a -> league 1, /b -> 2, ...)
 * and resolved against getLeagues (the same query the tab bar uses), so the
 * link can't drift from the server's league order. Falls back to the first
 * league when the slug doesn't match (e.g. on "/").
 */
export default function EspnLink() {
  const pathname = usePathname();
  const index = slugToIndex(pathname.split("/")[1] ?? "");

  const [{ data }] = useQuery({ query: leaguesQuery });
  const leagues = data?.getLeagues?.leagues ?? [];
  const league =
    leagues.find((l) => l.index === index) ?? leagues.at(0);

  return (
    <div className={classNames(styles.courtLogo, "justify-end")}>
      <a href={league?.espnUrl ?? ""} className={styles.espnLogo}>
        <span className={styles.courtLogoStretch}>ESPN</span>
        <div className="flex flex-col text-xs">
          <span className="tracking-wide">FANTASY</span>
          <span className="tracking-widest">LEAGUE</span>
        </div>
      </a>
    </div>
  );
}
