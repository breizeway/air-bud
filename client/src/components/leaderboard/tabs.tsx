"use client";

import { classNames } from "@/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { leagueSlug } from "./league-slug";
import styles from "./leaderboard.module.css";

interface LeagueTab {
  index: number;
  name: string;
}

/**
 * League tabs — a semantic ARIA tablist rendered with links (each tab navigates
 * to /<index>). Horizontally scrollable; the active tab scrolls into view and
 * the scroll edges fade when there are more tabs off-screen (Chrome-like).
 */
export default function LeagueTabs({
  leagues,
  leagueIndex,
}: {
  leagues: LeagueTab[];
  leagueIndex: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [fade, setFade] = useState({ left: false, right: false });

  const updateFade = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setFade({
      left: scrollLeft > 1,
      right: scrollLeft + clientWidth < scrollWidth - 1,
    });
  };

  useEffect(() => {
    updateFade();
    const el = scrollRef.current;
    el?.addEventListener("scroll", updateFade, { passive: true });
    window.addEventListener("resize", updateFade);
    return () => {
      el?.removeEventListener("scroll", updateFade);
      window.removeEventListener("resize", updateFade);
    };
  }, [leagues.length]);

  // Scroll the active tab into view (horizontally only, like a browser tab strip).
  useEffect(() => {
    const el = scrollRef.current;
    const tab = activeRef.current;
    if (el && tab) {
      // Position relative to the scroll container's visible edge (offsetLeft is
      // relative to the positioned toolbar, not the scroller, so don't use it).
      const delta =
        tab.getBoundingClientRect().left - el.getBoundingClientRect().left;
      // Center a tab that fits; show the start of one too wide to fit.
      const target =
        tab.clientWidth >= el.clientWidth
          ? el.scrollLeft + delta
          : el.scrollLeft + delta - (el.clientWidth - tab.clientWidth) / 2;
      el.scrollTo({
        left: Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth)),
        behavior: "smooth",
      });
    }
    const settle = setTimeout(updateFade, 400);
    return () => clearTimeout(settle);
  }, [leagueIndex, leagues.length]);

  // A single fade width for both edges; an edge only fades when it can scroll
  // further that way. (left stop, right stop) -> one left-to-right gradient.
  const FADE = "1.25rem";
  const left = fade.left ? `transparent, #000 ${FADE}` : "#000";
  const right = fade.right ? `#000 calc(100% - ${FADE}), transparent` : "#000";
  const maskImage = `linear-gradient(to right, ${left}, ${right})`;

  return (
    <div
      ref={scrollRef}
      role="tablist"
      aria-label="Leagues"
      className={styles.tabs}
      style={{ WebkitMaskImage: maskImage, maskImage }}
    >
      {leagues.map((league) => {
        const active = league.index === leagueIndex;
        return (
          <Link
            key={league.index}
            ref={active ? activeRef : undefined}
            href={`/${leagueSlug(league.index)}`}
            role="tab"
            id={`league-tab-${league.index}`}
            aria-selected={active}
            aria-current={active ? "page" : undefined}
            tabIndex={active ? 0 : -1}
            className={classNames(
              styles.tab,
              active ? styles.tabActive : styles.tabInactive
            )}
          >
            {league.name}
          </Link>
        );
      })}
    </div>
  );
}
