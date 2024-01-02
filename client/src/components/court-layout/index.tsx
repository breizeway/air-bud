import { PropsWithChildren } from "react";
import styles from "./court-layout.module.css";
import Link from "next/link";
import RemImage from "../rem-image";
import { classNames } from "@/utils";

const LEAGUE_ID = process.env.NEXT_PUBLIC_LEAGUE_ID;

export default function CourtLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.court}>
      <header className={styles.top}>
        <LeagueLogo />

        {/* <div className="flex gap-1 items-center grow">
          <RemImage
            src="/construction-bar.gif"
            alt='rotating "under construction" sign'
            wRem={8.259625}
            hRem={2.25}
          />
        </div> */}
        <EspnLogo />
      </header>
      <footer className={styles.bottom}>
        <LeagueLogo />
        <a
          href="https://github.com/breizeway/air-bud"
          className="block rounded-full overflow-hidden min-w-fit"
        >
          <RemImage
            src="/github-mark.svg"
            alt="github logo"
            wRem={1.75}
            hRem={1.75}
          />
        </a>
        <EspnLogo />
      </footer>
      <div className={styles.left} />
      <div className={styles.right} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

function LeagueLogo() {
  return (
    <div className={styles.courtLogo}>
      <Link href="/" className={styles.leagueLogo}>
        <span className={styles.courtLogoStretch}>BALL IS LYF3</span>
      </Link>
    </div>
  );
}

function EspnLogo() {
  return (
    <div className={classNames(styles.courtLogo, "justify-end")}>
      <a
        href={`https://fantasy.espn.com/basketball/league?leagueId=${LEAGUE_ID}`}
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
