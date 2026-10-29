"use client";

import { slugToIndex } from "@/components/leaderboard/league-slug";
import { classNames } from "@/utils";
import { usePathname } from "next/navigation";
import styles from "./court-layout.module.css";

// ESPN league ids in league order (comma-separated; a single id still works).
const LEAGUE_IDS = (process.env.NEXT_PUBLIC_LEAGUE_ID ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

/**
 * ESPN "FANTASY LEAGUE" logo link. Points at whichever league the table is
 * currently showing — derived from the URL slug (/a -> league 1, /b -> 2, ...)
 * mapped onto NEXT_PUBLIC_LEAGUE_ID. Falls back to the first league.
 */
export default function EspnLink() {
  const pathname = usePathname();
  const index = slugToIndex(pathname.split("/")[1] ?? "");
  const leagueId =
    (Number.isInteger(index) && index >= 1 && LEAGUE_IDS[index - 1]) ||
    LEAGUE_IDS[0] ||
    "";

  return (
    <div className={classNames(styles.courtLogo, "justify-end")}>
      <a
        href={`https://fantasy.espn.com/basketball/league?leagueId=${leagueId}`}
        className={styles.espnLogo}
      >
        <span className={styles.courtLogoStretch}>ESPN</span>
        <div className="flex flex-col text-xs">
          <span className="tracking-wide">FANTASY</span>
          <span className="tracking-widest">LEAGUE</span>
        </div>
      </a>
    </div>
  );
}
